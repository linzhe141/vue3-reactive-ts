# 基于 TypeScript 实现简易版的 Vue3 响应式系统

这是一个简单的 Vue3 响应式系统的实现，包含了以下几个 API：

- `reactive(obj)`：将一个普通对象转化为响应式对象。
- `ref(value:baseType | object)`：将一个基本类型或普通对象类型转化为响应式对象。
- `computed(fn:getter)`：创建一个计算属性。
- `watch(fn:getter, {immediate?:boolean})`：用于监听响应式对象的变化。
- `effect(fn)`：创建一个副作用函数，用于在响应式对象发生变化时执行。

## reactive

`reactive(obj)` 接受一个普通对象 `obj` 作为参数，将其转化为响应式对象，并返回一个 Proxy 对象。使用 Proxy 对象访问响应式对象的属性时，会自动跟踪属性的依赖关系，并在属性发生变化时触发更新。

```typescript
import { reactive } from './reactivity';

const state = reactive({
  count: 0
});

console.log(state.count); // 0

state.count++;
console.log(state.count); // 1
```

## ref

`ref(value:baseType | object)` 接受一个基本类型或者普通对象 `value` 作为参数，将其转化为响应式对象(利用reactive实现)，并返回一个 Proxy 对象。使用 Proxy 对象访问响应式对象的属性时，会自动跟踪属性的依赖关系，并在属性发生变化时触发更新。

```typescript
import { ref } from './reactivity';

const state = ref(1);

console.log(state.value); // 1

state.value++;
console.log(state.value); // 2
```

## computed

`computed(fn)` 接受一个计算函数 `fn` 作为参数，创建一个计算属性，并返回一个响应式对象。计算属性的值会根据其依赖的响应式对象自动更新。

```typescript
import { reactive, effect, computed, watch } from './reactivity';

const state = reactive({
  count: 0
});

const doubled = computed(() => state.count * 2);

console.log(doubled.value); // 0

state.count++;
console.log(doubled.value); // 2
```

## watch

`watch(fn, {immediate?:boolean})` 接受一个函数 `fn` 作为参数，创建一个 effect，用于监听响应式对象的变化。当响应式对象发生变化时，effect 会自动执行函数 `fn`。

```typescript
import { reactive, watch } from './reactivity';

const state = reactive({
  count: 0
});

watch(
  () => state.count,
  (newValue, oldValue) => {
    console.log('newValue:', newValue, 'oldValue:', oldValue);
  }
);

state.count++; // 'newValue:', 1, 'oldValue:', 0
state.count++; // 'newValue:', 2, 'oldValue:', 1
```

## effect

`effect(fn)` 接受一个函数 `fn` 作为参数，创建一个副作用函数，用于在响应式对象发生变化时执行。

```typescript
import { reactive, effect } from './reactivity';

const state = reactive({
  count: 0
});

effect(() => {
  console.log(state.count); //0
});

state.count++; // 输出 1
state.count++; // 输出 2
```
