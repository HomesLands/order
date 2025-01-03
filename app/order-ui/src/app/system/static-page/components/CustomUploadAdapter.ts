import type { Editor } from '@ckeditor/ckeditor5-core'
import type { FileLoader } from '@ckeditor/ckeditor5-upload'
import type { UploadAdapter } from '@ckeditor/ckeditor5-upload'

export class CustomUploadAdapter implements UploadAdapter {
  constructor(private loader: FileLoader) {}

  upload(): Promise<{ default: string }> {
    return this.loader.file.then((file: File | null) => {
      if (!file) {
        return Promise.reject('No file found')
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve({
            default: reader.result as string,
          })
        }
        reader.onerror = () => reject('Error reading file')
        reader.readAsDataURL(file)
      })
    })
  }

  abort(): void {
    // Xử lý hủy upload nếu cần
  }
}

export function CustomUploadAdapterPlugin(editor: Editor): void {
  editor.plugins.get('FileRepository').createUploadAdapter = (
    loader: FileLoader,
  ) => {
    return new CustomUploadAdapter(loader)
  }
}
