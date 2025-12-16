export type FormComponentType = 'input' | 'password' | 'textarea' | 'select' | 'switch' | 'number';

export interface FormOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface FormField {
  field: string;
  label: string;
  component: FormComponentType;
  placeholder?: string;
  required?: boolean;
  initialValue?: any;
  options?: FormOption[];
  props?: Record<string, any>;
  roles?: string[];
  permissions?: string[];
  visible?: (model: Record<string, any>, context?: Record<string, any>) => boolean;
  disabled?: (model: Record<string, any>, context?: Record<string, any>) => boolean;
  asyncValidator?: (value: any, model: Record<string, any>) => Promise<void>;
  description?: string;
}

export interface FormSchema {
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: Record<string, any>;
  wrapperCol?: Record<string, any>;
  fields: FormField[];
}
