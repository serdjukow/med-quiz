import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DEFAULT_MEDICINA_DECK_ID } from './utils/medicinaDecks'
import {
	HOME_ROUTE,
	MEDICINA_ROUTE,
	MEDICINA_TEST_ROUTE,
	MEDICINA_CARDS_ROUTE,
	MEDICINA_GLOSSARY_ROUTE,
	MEDICINA_PROGRESS_ROUTE,
	GET_STARTED_ROUTE,
	FAQ_ROUTE,
} from './utils/consts'

const HomePage = lazy(() => import('./Pages/HomePage/HomePage'))
const MedicinaHubPage = lazy(() => import('./Pages/Medicina/MedicinaHubPage'))
const MedicinaTestPage = lazy(() => import('./Pages/Medicina/MedicinaTestPage'))
const MedicinaCardsPage = lazy(() => import('./Pages/Medicina/MedicinaCardsPage'))
const MedicinaGlossaryHubPage = lazy(() => import('./Pages/Medicina/MedicinaGlossaryHubPage'))
const MedicinaGlossaryPage = lazy(() => import('./Pages/Medicina/MedicinaGlossaryPage'))
const MedicinaProgressPage = lazy(() => import('./Pages/Medicina/MedicinaProgressPage'))
const GetStarted = lazy(() => import('./Pages/GetStarted/GetStarted'))
const FaqPage = lazy(() => import('./Pages/FaqPage/FaqPage'))

export const useRoutes = () => {
	return (
		<Routes>
			<Route path={HOME_ROUTE} element={<HomePage />} />
			<Route path={GET_STARTED_ROUTE} element={<GetStarted />} />
			<Route path={FAQ_ROUTE} element={<FaqPage />} />
			<Route path={MEDICINA_ROUTE} element={<MedicinaHubPage />} />
			<Route path={MEDICINA_PROGRESS_ROUTE} element={<MedicinaProgressPage />} />

			<Route
				path={MEDICINA_TEST_ROUTE}
				element={
					DEFAULT_MEDICINA_DECK_ID ? (
						<Navigate to={`${MEDICINA_TEST_ROUTE}/${DEFAULT_MEDICINA_DECK_ID}`} replace />
					) : (
						<Navigate to={MEDICINA_ROUTE} replace />
					)
				}
			/>
			<Route path={`${MEDICINA_TEST_ROUTE}/:deckId`} element={<MedicinaTestPage />} />

			<Route
				path={MEDICINA_CARDS_ROUTE}
				element={
					DEFAULT_MEDICINA_DECK_ID ? (
						<Navigate to={`${MEDICINA_CARDS_ROUTE}/${DEFAULT_MEDICINA_DECK_ID}`} replace />
					) : (
						<Navigate to={MEDICINA_ROUTE} replace />
					)
				}
			/>
			<Route path={`${MEDICINA_CARDS_ROUTE}/:deckId`} element={<MedicinaCardsPage />} />

			<Route path={MEDICINA_GLOSSARY_ROUTE} element={<MedicinaGlossaryHubPage />} />
			<Route path={`${MEDICINA_GLOSSARY_ROUTE}/:deckId`} element={<MedicinaGlossaryPage />} />

			<Route path="*" element={<Navigate to={HOME_ROUTE} replace />} />
		</Routes>
	)
}
