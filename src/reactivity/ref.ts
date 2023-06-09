import { isObject } from '../shared';
import { reactive, track, trggier } from './reactive';
// export function ref<T>(value: T) {
//   return reactive({
//     value
//   });
// }
export function ref<T>(value: T) {
  return new RefImpl(value);
}
class RefImpl<T> {
  private _value: any;
  constructor(value: T) {
    this._value = isObject(value) ? reactive(value) : value;
  }
  get value() {
    track(this, 'value');
    return this._value;
  }
  set value(newValue) {
    this._value = isObject(newValue) ? reactive(newValue) : newValue;
    trggier(this, 'value');
  }
}
