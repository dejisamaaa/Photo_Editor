import { LocalImagePicker } from './LocalPick';
import Header from './Header';
import Footer from './Footer.tsx';
import 'context-filter-polyfill';

function App() {
  return (
    <div className="App">
      <Header />
      <LocalImagePicker />
     <Footer />
    </div>
  )
}

export default App
