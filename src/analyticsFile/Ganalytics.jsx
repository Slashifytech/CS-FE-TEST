import ReactGA from 'react-ga';

export const initGA = () => {
  ReactGA.initialize('G-8C46S9L80Q');
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};