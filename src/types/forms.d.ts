interface MyField<T> {
  name: string
  initialValue: T
  label: string
  placeholder: string
  validate?: (value: T) => string
  isRequired?: boolean
  possibleValues?: T[],
  minNumber?: number,
  maxNumber?: number
}

type TextField = MyField<string>;
type TextSelectField = MyField<string>;
type NumberField = MyField<number>;
