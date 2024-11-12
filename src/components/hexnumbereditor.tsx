import { hexStr } from "./common";

export function HexNumberEditor(props: {
    onChange: (value: number) => void,
    onValidate: (value: number) => void,
    onCancel: () => void,
    value: number
  }) {

  const onDown = (evt : KeyboardEvent) => {
    if (evt.key === 'Enter') {
      const strVal = (evt.currentTarget as HTMLInputElement).value;
      const asNum = Number.parseInt(strVal, 16)
      props.onValidate(asNum);
    } else if (evt.key === 'Escape') {
      props.onCancel();
    }
  };

  const onChange = (evt : Event) => {
    const strVal = (evt.currentTarget as HTMLInputElement).value;
    const asNum = Number.parseInt(strVal, 16)
    props.onChange(asNum);
  };

  return <input
    autoFocus={true}
    class="songchain scselect"
    type="text"
    maxlength={2}
    pattern="[a-fA-F0-9]{2}"
    value={hexStr(props.value)}
    onChange={(evt) => onChange(evt)}
    onKeyDown={(evt) => onDown(evt)} />
}

export function NameEditor(props: {
    onChange: (value: string) => void,
    onValidate: (value: string) => void,
    onCancel: () => void,
    max: number,
    value: string
  }) {

  const onDown = (evt : KeyboardEvent) => {
    if (evt.key === 'Enter') {
      const strVal = (evt.currentTarget as HTMLInputElement).value;
      props.onValidate(strVal);
    } else if (evt.key === 'Escape') {
      props.onCancel();
    }
  };

  const onChange = (evt : Event) => {
    const strVal = (evt.currentTarget as HTMLInputElement).value;
    props.onChange(strVal);
  };

  return <input
    autoFocus={true}
    class="nameedit scselect"
    type="text"
    maxlength={props.max}
    value={props.value}
    onChange={(evt) => onChange(evt)}
    onKeyDown={(evt) => onDown(evt)} />
}