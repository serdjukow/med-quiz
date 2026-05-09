import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Loader from './Layouts/Loader/Loader'
import { useRoutes } from './routes'
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./App.scss";

const AppPage = () => {
	const routes = useRoutes()

	return (
		<BrowserRouter>
			<div className="wrapper">
				<Header />
				<div className="page"><Suspense fallback={<Loader />}>{routes}</Suspense></div>
				<Footer />
			</div>
		</BrowserRouter>
	)
}

export default AppPage;
