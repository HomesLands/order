declare module '@ckeditor/ckeditor5-build-decoupled-document' {
  interface HeadingOption {
    model:
      | 'paragraph'
      | 'heading1'
      | 'heading2'
      | 'heading3'
      | 'heading4'
      | 'heading5'
      | 'heading6'
    view?: string
    title: string
    class: string
  }

  interface EditorConfig {
    toolbar?: {
      items: string[]
      shouldNotGroupWhenFull?: boolean
    }
    plugins?: any[]
    balloonToolbar?: string[]
    fontFamily?: {
      supportAllValues?: boolean
      options?: string[]
    }
    fontSize?: {
      options?: (number | string)[]
      supportAllValues?: boolean
    }
    heading?: {
      options: HeadingOption[]
    }
    initialData?: string
    licenseKey?: string
    placeholder?: string
    link?: {
      addTargetToExternalLinks?: boolean
      defaultProtocol?: string
      decorators?: Record<string, any>
    }
    table?: {
      contentToolbar?: string[]
    }
    [key: string]: any
  }

  interface EditorInstance {
    ui: {
      view: {
        toolbar: {
          element: HTMLElement
        }
        menuBarView: {
          element: HTMLElement
        }
      }
    }
    getData(): string
    setData(data: string): void
    destroy(): Promise<void>
  }

  class DecoupledEditor {
    static create(
      element: HTMLElement,
      config?: EditorConfig,
    ): Promise<EditorInstance>
    static EditorWatchdog: any
    static ContextWatchdog: any
    destroy(): Promise<void>
  }

  export = DecoupledEditor
}

declare module 'ckeditor5-custom-build' {
  const Alignment: any
  const AutoLink: any
  const Autosave: any
  const BalloonToolbar: any
  const Bold: any
  const Bookmark: any
  const Code: any
  const Essentials: any
  const FontBackgroundColor: any
  const FontColor: any
  const FontFamily: any
  const FontSize: any
  const Heading: any
  const HorizontalLine: any
  const Indent: any
  const IndentBlock: any
  const Italic: any
  const Link: any
  const Paragraph: any
  const RemoveFormat: any
  const SpecialCharacters: any
  const Strikethrough: any
  const Subscript: any
  const Superscript: any
  const Table: any
  const TableCaption: any
  const TableCellProperties: any
  const TableColumnResize: any
  const TableProperties: any
  const TableToolbar: any
  const Underline: any

  export {
    Alignment,
    AutoLink,
    Autosave,
    BalloonToolbar,
    Bold,
    Bookmark,
    Code,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Heading,
    HorizontalLine,
    Indent,
    IndentBlock,
    Italic,
    Link,
    Paragraph,
    RemoveFormat,
    SpecialCharacters,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    Underline,
  }
}
