/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
import interact from"interactjs";import DocumentService from"@typo3/core/document-service.js";import PersistentStorage from"@typo3/backend/storage/persistent.js";import RegularEvent from"@typo3/core/event/regular-event.js";import DebounceEvent from"@typo3/core/event/debounce-event.js";var Selectors;!function(e){e.resizableContainerIdentifier=".t3js-viewpage-resizeable",e.moduleBodySelector=".t3js-module-body",e.customSelector=".t3js-preset-custom",e.customWidthSelector=".t3js-preset-custom-width",e.customHeightSelector=".t3js-preset-custom-height",e.changeOrientationSelector=".t3js-change-orientation",e.changePresetSelector=".t3js-change-preset",e.inputWidthSelector=".t3js-viewpage-input-width",e.inputHeightSelector=".t3js-viewpage-input-height",e.currentLabelSelector=".t3js-viewpage-current-label",e.topbarContainerSelector=".t3js-viewpage-topbar",e.refreshSelector=".t3js-viewpage-refresh"}(Selectors||(Selectors={}));class ViewPage{constructor(){this.defaultLabel="",this.minimalHeight=300,this.minimalWidth=300,this.storagePrefix="moduleData.web_ViewpageView.States.",DocumentService.ready().then((()=>{const e=document.querySelector(".t3js-preset-custom-label");this.defaultLabel=e?.textContent.trim()??"",this.iframe=document.getElementById("tx_this_iframe"),this.inputCustomWidth=document.querySelector(Selectors.inputWidthSelector),this.inputCustomHeight=document.querySelector(Selectors.inputHeightSelector),this.customPresetItem=document.querySelector(Selectors.customSelector),this.customPresetItemWidth=document.querySelector(Selectors.customWidthSelector),this.customPresetItemHeight=document.querySelector(Selectors.customHeightSelector),this.currentLabelElement=document.querySelector(Selectors.currentLabelSelector),this.resizableContainer=document.querySelector(Selectors.resizableContainerIdentifier),this.initialize()}))}getCurrentWidth(){return this.inputCustomWidth.valueAsNumber}getCurrentHeight(){return this.inputCustomHeight.valueAsNumber}setLabel(e){this.currentLabelElement.textContent=e}getCurrentLabel(){return this.currentLabelElement.textContent}persistChanges(e,t){PersistentStorage.set(e,t)}setSize(e,t){isNaN(t)&&(t=this.calculateContainerMaxHeight()),t<this.minimalHeight&&(t=this.minimalHeight),isNaN(e)&&(e=this.calculateContainerMaxWidth()),e<this.minimalWidth&&(e=this.minimalWidth),this.inputCustomWidth.valueAsNumber=e,this.inputCustomHeight.valueAsNumber=t,this.resizableContainer.style.width=`${e}px`,this.resizableContainer.style.height=`${t}px`,this.resizableContainer.style.left="0"}persistCurrentPreset(){let e={width:this.getCurrentWidth(),height:this.getCurrentHeight(),label:this.getCurrentLabel()};this.persistChanges(this.storagePrefix+"current",e)}persistCustomPreset(){let e={width:this.getCurrentWidth(),height:this.getCurrentHeight()};this.customPresetItem.dataset.width=e.width.toString(10),this.customPresetItem.dataset.height=e.height.toString(10),this.customPresetItemWidth.textContent=e.width.toString(10),this.customPresetItemHeight.textContent=e.height.toString(10),this.persistChanges(this.storagePrefix+"current",e),this.persistChanges(this.storagePrefix+"custom",e)}persistCustomPresetAfterChange(){clearTimeout(this.queueDelayTimer),this.queueDelayTimer=window.setTimeout((()=>{this.persistCustomPreset()}),1e3)}initialize(){new RegularEvent("click",(()=>{this.setSize(this.getCurrentHeight(),this.getCurrentWidth()),this.persistCurrentPreset()})).bindTo(document.querySelector(Selectors.changeOrientationSelector)),[this.inputCustomWidth,this.inputCustomHeight].forEach((e=>{new DebounceEvent("change",(()=>{this.setSize(this.getCurrentWidth(),this.getCurrentHeight()),this.setLabel(this.defaultLabel),this.persistCustomPresetAfterChange()}),50).bindTo(e)})),new RegularEvent("click",((e,t)=>{this.setSize(parseInt(t.dataset.width,10),parseInt(t.dataset.height,10)),this.setLabel(t.dataset.label),this.persistCurrentPreset()})).delegateTo(document,Selectors.changePresetSelector),new RegularEvent("click",(()=>{this.iframe.contentWindow.location.reload()})).bindTo(document.querySelector(Selectors.refreshSelector)),interact(this.resizableContainer).on("resizestart",(e=>{const t=document.createElement("div");t.id="viewpage-iframe-cover",t.setAttribute("style","z-index:99;position:absolute;width:100%;top:0;left:0;height:100%;"),e.target.appendChild(t)})).on("resizeend",(()=>{document.getElementById("viewpage-iframe-cover").remove(),this.persistCustomPreset()})).resizable({origin:"self",edges:{top:!1,left:!0,bottom:!0,right:!0},listeners:{move:e=>{Object.assign(e.target.style,{width:`${e.rect.width}px`,height:`${e.rect.height}px`}),this.inputCustomWidth.valueAsNumber=e.rect.width,this.inputCustomHeight.valueAsNumber=e.rect.height,this.setLabel(this.defaultLabel)}},modifiers:[interact.modifiers.restrictSize({min:{width:this.minimalWidth,height:this.minimalHeight}})]})}calculateContainerMaxHeight(){this.resizableContainer.hidden=!0;const e=getComputedStyle(document.querySelector(Selectors.moduleBodySelector)),t=parseFloat(e.getPropertyValue("padding-top"))+parseFloat(e.getPropertyValue("padding-bottom")),i=document.body.getBoundingClientRect().height,r=document.querySelector(Selectors.topbarContainerSelector).getBoundingClientRect().height;return this.resizableContainer.hidden=!1,i-t-r-8}calculateContainerMaxWidth(){this.resizableContainer.hidden=!0;const e=getComputedStyle(document.querySelector(Selectors.moduleBodySelector)),t=parseFloat(e.getPropertyValue("padding-left"))+parseFloat(e.getPropertyValue("padding-right")),i=document.body.getBoundingClientRect().width;return this.resizableContainer.hidden=!1,i-t}}export default new ViewPage;