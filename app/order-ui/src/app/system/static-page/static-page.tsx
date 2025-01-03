import { useState, useEffect } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CustomUploadAdapterPlugin } from './components/CustomUploadAdapter'

const LICENSE_KEY =
  'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzcxNTgzOTksImp0aSI6ImQ3ZTA3ZjZjLTY2NDYtNDdmYy1iNDQ3LWFlMzMwZTI2MWVkZiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImQ2NGZlN2VkIn0.AZAEbT9H0MNT6GRDgmkQZ9I5EZ0lfqHdJTNISamd-kF6-MlruQDNPD4VMO2yRiTwDOkjRLq7g2Oqs_kvogjZ9A'

export default function StaticPage() {
  const [, setIsReady] = useState(false)

  const editorConfig = {
    licenseKey: LICENSE_KEY,
    language: 'vi',
    extraPlugins: [CustomUploadAdapterPlugin],
    toolbar: {
      items: [
        // Định dạng văn bản cơ bản
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        // Font và màu sắc
        'fontSize',
        'fontColor',
        '|',
        // Căn chỉnh
        'alignment',
        '|',
        // Danh sách
        'numberedList',
        'bulletedList',
        '|',
        // Thụt lề
        'indent',
        'outdent',
        '|',
        // Chèn đối tượng
        'link',
        'insertImage',
        'insertTable',
        '|',
        // Công cụ
        'undo',
        'redo',
      ],
    },
    image: {
      upload: {
        types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'],
      },
      toolbar: [
        'imageTextAlternative',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
      ],
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
  }

  useEffect(() => {
    setIsReady(true)
    return () => setIsReady(false)
  }, [])

  return (
    <div className="editor-container">
      <CKEditor
        editor={ClassicEditor}
        data="<p>Hello from CKEditor 5!</p>"
        onReady={(editor) => {
          console.log('Editor is ready to use!', editor)
        }}
        onChange={(event, editor) => {
          const data = editor.getData()
          console.log({ event, editor, data })
        }}
        config={editorConfig}
      />
    </div>
  )
}
