interface MyField<T> {
  name: string
  initialValue?: T
  label: string
  placeholder: string
  validate?: (value: T) => string
  isRequired?: boolean
  possibleValues?: T[],
  isRadio?: boolean,
  minNumber?: number,
  maxNumber?: number,
  undefinedType?: string,
  textArea?: boolean
}

type TextField = MyField<string>;
type TextSelectField = MyField<string>;
type NumberField = MyField<number>;
type CheckboxGroupField = MyField<string[]>;
type RadioField = MyField<string>;