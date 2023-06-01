import { ReactiveEffect } from './effect';
import { track, trggier } from './reactive';

type ComputedGetter<T = any> = (...args: any[]) => T;
export function computed(getter: ComputedGetter) {
  return new ComputedRefImpl(getter);
}
class ComputedRefImpl<T> {
  private _value!: T;
  effect: ReactiveEffect;
  dirty = true;
  constructor(getter: ComputedGetter<T>) {
    this.effect = new ReactiveEffect(getter, {
      // 当依赖发生变化时触发调度器
      // 箭头函数this指向问题
      scheduler: () => {
        if (!this.dirty) {
          this.dirty = true;
          trggier(this, 'value');
        }
      }
    });
  }
  // 取值进行依赖收集
  get value() {
    if (this.dirty) {
      this.dirty = false;
      this._value = this.effect.run();
    }
    // 收集上层 副作用函数 例如render
    track(this, 'value');
    return this._value;
  }
}
