declare module 'react-native-pell-rich-editor' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  export interface EditorStyles {
    backgroundColor?: string;
    contentCSSText?: string;
    [key: string]: any;
  }

  export interface RichEditorProps {
    initialContentHTML?: string;
    onChange?: (text: string) => void;
    placeholder?: string;
    style?: ViewStyle;
    initialHeight?: number;
    editorStyle?: EditorStyles;
    editorInitializedCallback?: () => void;
    disabled?: boolean;
    useContainer?: boolean;
    pasteAsPlainText?: boolean;
    ref?: any;
    onCursorPosition?: (scrollY: number) => void;
  }

  export interface RichToolbarProps {
    editor?: any;
    actions?: string[];
    iconMap?: { [key: string]: () => JSX.Element };
    onPressAddImage?: () => void;
    style?: ViewStyle;
    disabled?: boolean;
    selectedIconTint?: string;
    disabledIconTint?: string;
    selectedButtonStyle?: ViewStyle;
  }

  export class RichEditor extends Component<RichEditorProps> {
    insertImage: (url: string) => void;
    insertHTML: (html: string) => void;
    setContentHTML: (html: string) => void;
    blurContentEditor: () => void;
    focusContentEditor: () => void;
    getContentHTML: () => Promise<string>;
    scrollHeight: () => Promise<number>;
    scrollTo: (options: { y: number }) => void;
  }

  export class RichToolbar extends Component<RichToolbarProps> {}
  
  export const actions: {
    setBold: string;
    setItalic: string;
    setUnderline: string;
    setStrikethrough: string;
    alignLeft: string;
    alignCenter: string;
    alignRight: string;
    insertBulletsList: string;
    insertOrderedList: string;
    [key: string]: string;
  };
} 