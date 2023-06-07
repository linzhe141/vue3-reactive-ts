import { reactive, effect, computed, watch, ref } from './reactivity';
const refValue = ref(1);
const refObjValue = ref({ test: 111 });
const obj = reactive({
  flag: true,
  son: {
    value: 1
  },
  foo: 1,
  x: 1,
  y: 2
});

(window as any).__obj__ = obj;
(window as any).__refValue__ = refValue;
(window as any).__refObjValue__ = refObjValue;

const double = computed(() => {
  console.log('computed~~~~');
  return obj.foo * 2;
});
(window as any).__double__ = double;
// !basic 响应式
// effect(function render() {
//   console.log('render~~~~~~');
//   document.body.innerHTML = `
//     <div>foo:${obj.foo}</div>
//   `;
// });

// !ref
effect(function render() {
  console.log('render~~~~~~');
  document.body.innerHTML = `
    <div>refValue:${refObjValue.value.test}</div>
    <div>refValue:${refValue.value}</div>
  `;
});

// !懒递归 嵌套对象
// effect(function render() {
//   console.log('render~~~~~~');
//   document.body.innerHTML = `
//     <div>${obj.son.value}</div>
//   `;
// });

// !嵌套effect
// effect(function parentRender() {
//   effect(function sonRender() {
//     console.log('类比--子组件', obj.foo);
//   });
//   console.log('类比--父组件', obj.foo);
// });

// !cleanUp
// effect(function render() {
//   console.log('render~~~~~~');
//   document.body.innerHTML = `
//     xxxxxxxxxxxxxxxx--->${obj.flag ? obj.x : obj.y}
//   `;
// });

// !computed
// effect(function render() {
//   console.log('render~~~~~~');
//   document.body.innerHTML = `
//     <div>foo:${obj.foo}</div>
//     <div>compued:douobulefoo--->${double.value}</div>
//   `;
// });

// !watch
watch(
  () => obj.foo,
  function (newValue, oldValue) {
    console.log('watch:obj.foo==oldvalue---->', oldValue);
    console.log('watch:obj.foo==newValue---->', newValue);
  },
  { immediate: true }
);
