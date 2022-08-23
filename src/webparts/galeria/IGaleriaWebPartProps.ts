export interface IGaleriaWebPartProps {
  listName: string;
  items: any[];
  query: string;

  enableArrows: boolean;
  enableBullets: boolean;
  enablePlayButton: boolean;
  enableFullscreenButton: boolean;
  enableZoomPanel: boolean;
  controlsAlwaysOn: boolean;

  preserveRatio: boolean;
  pauseOnMouseover: boolean;
  carousel: boolean;
  autoplay: boolean;
  speed: number;
  transition: string;
  enableProgressIndicator: string;
  bulletsAlignHor: string;
  backgroundColor: string;

  textPanelEnable: boolean;
  textPanelAlwaysOnTop: boolean;
  textPanelPosition: string;
  textPanelOpacity: string;
}
