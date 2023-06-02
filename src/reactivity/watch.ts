import { effect } from './effect';
type WatchGetter = () => any;
type WatchCallback = (newValue: any, oldValue: any) => any;
type WatchOptions = { immediate: boolean };
export function watch(
  getter: WatchGetter,
  callback: WatchCallback,
  options?: WatchOptions
) {
  let oldValue: any;
  let newValue;

  const job = () => {
    newValue = watchEffect.run();
    callback(newValue, oldValue);
    oldValue = newValue;
  };
  const watchEffect = effect(() => getter(), {
    // 手动调用
    lazy: true,
    scheduler() {
      job();
    }
  });
  if (options?.immediate) {
    job();
  } else {
    // 手动调用拿到返回值，并进行依赖收集
    oldValue = watchEffect.run();
  }
}
