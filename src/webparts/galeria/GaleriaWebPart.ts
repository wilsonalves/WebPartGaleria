import { Version } from '@microsoft/sp-core-library';

import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IWebPartContext,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneSlider
} from '@microsoft/sp-webpart-base';

import { escape } from '@microsoft/sp-lodash-subset';
import * as strings from 'GaleriaWebPartStrings';

import * as $ from 'jquery';
import { IGaleriaWebPartProps } from './IGaleriaWebPartProps';
require('unitegallery');
require('ug-theme-slider');

//Loads external CSS files
require('../../css/unitegallery/unite-gallery.scss');

export default class GaleriaWebPart extends BaseClientSideWebPart <IGaleriaWebPartProps> {

  private guid: string;

  public constructor() {
    super();

    this.guid = this.getGuid();

    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  public async ListaBanners() {

    if(this.properties.listName === undefined)
    {
      //Display select a list message
      this.domElement.innerHTML = `
      <div class="ms-MessageBar">
        <div class="ms-MessageBar-content">
          <div class="ms-MessageBar-icon">
            <i class="ms-Icon ms-Icon--Info"></i>
          </div>
          <div class="ms-MessageBar-text">
            ${strings.ErrorSelectList}
          </div>
        </div>
      </div>
    `;
    return;
    }

    await $.ajax({
      url: `${this.context.pageContext.web.absoluteUrl}` +
        `/_api/web/lists/getByTitle('${this.properties.listName}')/items?$select=ID,Title,Enable,Description,LinkUrl,Picture`,
      method: 'GET',
      headers: {
        Accept: 'application/json; odata=verbose'
      },
      success: (data) => {

        if (data.d.results.length > 0) {
          this.properties.items = data.d.results;

          var outputHtml: string = '';
          outputHtml +=`<div id="${this.guid}-gallery" style="display:none;">`;

          for (var i = 0; i < this.properties.items.length; i++) {
            var newsItem: any = this.properties.items[i];
            var newsTitle: string = newsItem['Title'];
            var newsDesc: string = newsItem['Description'];
            var newsEnable: string = newsItem['Enable'];
            var newsPicUrl: string = newsItem['Picture'];
            var newsLink: string = newsItem['LinkUrl'];

            if (newsEnable == "false")
              continue;

            //Render the item
            outputHtml += `<a href=${newsLink}><img alt=${newsTitle} src=${newsPicUrl}
            data-image=${newsPicUrl} data-description=${newsDesc}></a>`;
          }

          outputHtml += '</div>';
          this.domElement.innerHTML = outputHtml;

          this.renderContents();
        }

      },
      error: (errorCode, errorMessage) => {
        console.log('Erro ao recuperar os itens. \nError: ' + errorCode + '\nStackTrace: ' + errorMessage);
      }
    });
  }

  public render(): void {

    this.ListaBanners();

  }

  private renderContents(): void {

    try {
      ($ as any)("#" + this.guid + "-gallery").unitegallery({
        gallery_theme: "slider",
        slider_enable_arrows: this.properties.enableArrows,
        slider_enable_bullets: this.properties.enableBullets,
        slider_transition: this.properties.transition,
        gallery_preserve_ratio: this.properties.preserveRatio,
        gallery_autoplay: this.properties.autoplay,
        gallery_play_interval: this.properties.speed,
        gallery_pause_on_mouseover: this.properties.pauseOnMouseover,
        gallery_carousel: this.properties.carousel,
        slider_enable_progress_indicator: this.properties.enableProgressIndicator,
        slider_enable_play_button: this.properties.enablePlayButton,
        slider_enable_fullscreen_button: this.properties.enableFullscreenButton,
        slider_enable_zoom_panel: this.properties.enableZoomPanel,
        slider_controls_always_on: this.properties.controlsAlwaysOn,
        slider_enable_text_panel: this.properties.textPanelEnable,
        slider_textpanel_always_on: this.properties.textPanelAlwaysOnTop,
        slider_textpanel_bg_opacity: this.properties.textPanelOpacity
      });
    }
    finally {

    }
  }

  private getGuid(): string {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  private s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: {
          description: strings.PropertyPageGeneral
        },
        displayGroupsAsAccordion: true,
        groups: [
          {
            groupName: strings.BasicGroupName,
            groupFields: [
              PropertyPaneTextField('listName', {
                label: strings.ListName
              })
            ]
          },
          {
            groupName: strings.GeneralGroupName,
            groupFields: [
              PropertyPaneToggle('enableArrows', {
                label: strings.EnableArrows
              }),
              PropertyPaneToggle('enableBullets', {
                label: strings.EnableBullets
              }),
              PropertyPaneToggle('enableProgressIndicator', {
                label: strings.EnableProgressIndicator
              }),
              PropertyPaneToggle('enablePlayButton', {
                label: strings.EnablePlayButton
              }),
              PropertyPaneToggle('enableFullscreenButton', {
                label: strings.EnableFullscreenButton
              }),
              PropertyPaneToggle('enableZoomPanel', {
                label: strings.EnableZoomPanel
              }),
              PropertyPaneToggle('controlsAlwaysOn', {
                label: strings.ControlsAlwaysOn
              })
            ]
          },
          {
            groupName: strings.EffectsGroupName,
            groupFields: [
              PropertyPaneDropdown('transition', {
                label: strings.Transition,
                options: [
                  { key: 'slide', text: 'Slide' },
                  { key: 'fade', text: 'Fade' }
                ]
              }),
              PropertyPaneToggle('preserveRatio', {
                label: strings.PreserveRatio
              }),
              PropertyPaneToggle('pauseOnMouseover', {
                label: strings.PauseOnMouseover
              }),
              PropertyPaneToggle('carousel', {
                label: strings.Carousel
              }),
              PropertyPaneToggle('autoplay', {
                label: strings.Autoplay
              }),
              PropertyPaneSlider('speed', {
                label: strings.Speed,
                min: 0,
                max: 7000,
                step: 100
              })
            ]
          }
        ]
      },
      {
        header: {
          description: strings.PropertyPageTextPanel
        },
        groups: [
          {
            groupName: strings.TextPanelGroupName,
            groupFields: [
              PropertyPaneToggle('textPanelEnable', {
                label: strings.TextPanelEnableFieldLabel
              }),
              PropertyPaneToggle('textPanelAlwaysOnTop', {
                label: strings.TextPanelAlwaysOnTopFieldLabel
              }),
              PropertyPaneSlider('textPanelOpacity', {
                label: strings.TextPanelOpacityFieldLabel,
                min: 0,
                max: 1,
                step: 0.1
              })
            ]
          }
        ]
      }
    ]
  };
}
}
