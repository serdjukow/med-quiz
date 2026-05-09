import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Loader from './Layouts/Loader/Loader'
import { useRoutes } from './routes'
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { ProgressProvider } from './progress/ProgressContext'
import "./App.scss";

const AppPage = () => {
	const routes = useRoutes()

	return (
		<BrowserRouter>
			<ProgressProvider>
				<div className="wrapper">
					<Header />
					<div className="page"><Suspense fallback={<Loader />}>{routes}</Suspense></div>
					<Footer />
				</div>
			</ProgressProvider>
		</BrowserRouter>
	)
}

export default AppPage;
