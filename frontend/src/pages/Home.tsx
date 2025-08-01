import FileUpload from '../components/FileUpload'
import ColumnSelector from '../components/ColumnSelector'
import Layout from '../components/Layout'
import { FileUploadProvider } from '../context/FileUploadContext'

function Home() {
  return (
    <Layout>
      <FileUploadProvider>
        <FileUpload />
        <ColumnSelector />
      </FileUploadProvider>
    </Layout>
  )
}

export default Home