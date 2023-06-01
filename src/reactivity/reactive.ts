/**
 * 介绍了proxy的receiver,并结合Reflect使用
 * https://juejin.cn/post/7085742282476879902
 * https://github.com/sl1673495/notes/issues/52
 * 在 Reflect.get 的场景下，receiver 可以改变计算属性（getter）中 this 的指向。
 * var target = { get a() { return this.b }}
 * Reflect.get(target, 'a', { b: 4}) // 4
 */
import { isObject } from '../shared';
import { activeEffect, ReactiveEffect } from './effect';

export const reactiveWeakMap = new WeakMap<object, any>();

export function reactive<T extends object>(target: T): T {
  const proxy = new Proxy<T>(target, {
    // target 源对象, key 属性名,  receiver proxy本身或者继承它的对象
    get(target: object, key: string, receiver: object) {
      // !解决了this指向的问题
      // 如果这么写 res = target[key];
      // const obj = {
      //   a: 1,
      //   get b() {
      //     return this.a;
      //   }
      // };
      // const proxyObj = reactive(obj)
      // effect(()=>{ proxyObj.b })
      // target.b => this指向target =>target.a
      // 相当于
      // effect(()=> (target)obj.a)
      // 这样effect中就是原始对象了，就不能够拦截了，自然就不能响应式跟新了

      // 简单理解的话，receiver相当于this，并且指向 proxy
      // 那么这样的话，effect(()=> proxyObj.a) 自然就能进行依赖收集了
      const res = Reflect.get(target, key, receiver);
      // 如果访问的key是一个对象
      // 只有在取值为对象时，才进行递归（懒递归，性能好一点）
      // vue2一开始会把所有属性都进行重写属性（getter，setter拦截）
      if (isObject(res)) {
        return reactive(res);
      }
      track(target, key);
      return res;
    },
    set(target: object, key: string, value: unknown, receiver: object) {
      if (value === Reflect.get(target, key, receiver)) return false;
      Reflect.set(target, key, value, receiver);
      trggier(target, key);
      return true;
    }
  });
  return proxy;
}
// 依赖收集
export function track(target: object, key: string) {
  if (!activeEffect) return;
  // 源对象的所有属性的依赖的map
  let depsMap = reactiveWeakMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    reactiveWeakMap.set(target, depsMap);
  }
  // 源对象各个属性 对应的所有effect副作用
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  // 利用set的去重能力
  dep.add(activeEffect);
  // 让副作用函数，也要收集对应不同key的的副作用集合
  activeEffect.deps.push(dep);
}

export function trggier(target: object, key: string) {
  // 源对象的所有属性的依赖的map
  const depsMap = reactiveWeakMap.get(target);
  if (!depsMap) return;
  // 源对象各个属性 对应的所有effect副作用
  let dep: Set<ReactiveEffect> = depsMap.get(key);
  if (!dep) return;
  // 死循环的坑，做一个拷贝，简单来说就是在遍历set的时候，先delete后add，导致的死循环
  // https://www.cnblogs.com/CherishTheYouth/p/CherishTheYouth_20220810.html
  const cloneDep = new Set(dep);
  cloneDep.forEach(reactiveEffect => {
    if (reactiveEffect.scheduler) {
      reactiveEffect.scheduler();
    } else {
      reactiveEffect.run();
    }
  });
}
