interface HomeProps {

}

import Image from 'next/image'
import whiteBayeuxLogo from '../assets/logoBayeuxBranca.png'
import Layout from './layout'

export default function Home(props: HomeProps) {
  return (
    <div>
      <Layout />
    </div>
  )
}
