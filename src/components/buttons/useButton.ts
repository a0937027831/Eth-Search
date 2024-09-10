export interface IBaseButtonProps {
  show?: boolean;
  disabled?: boolean;
  rounded?: string;
  click?: (e: Event) => void;
}

export const baseButtonDefaultProps = {
  show: true,
  disabled: false,
  rounded: 'lg',
  click: (e) => {},  // 默認空函數，符合 (e: Event) => void 類型
};

