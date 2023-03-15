interface HomeProps {

}

import Layout from './layout'
import LayoutBottom from './layoutBottom'
import AdminPanel from './users/AdminPanel'

export default function Home(props: HomeProps) {
  return (
    <div>
      <Layout />
      <AdminPanel />
      <LayoutBottom />
    </div>
  )
}
