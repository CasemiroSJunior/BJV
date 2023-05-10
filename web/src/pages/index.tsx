interface HomeProps {

}

import Layout from './layout'
import LayoutBottom from './layoutBottom'

export default function Home(props: HomeProps) {
  return (
    <div>
      <Layout />
      
      <LayoutBottom />
    </div>
  )
}
