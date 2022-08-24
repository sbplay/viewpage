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
import $ from"jquery";import"jquery-ui/resizable.js";import PersistentStorage from"@typo3/backend/storage/persistent.js";import SecurityUtility from"@typo3/core/security-utility.js";var Selectors;!function(e){e.resizableContainerIdentifier=".t3js-viewpage-resizeable",e.sizeIdentifier=".t3js-viewpage-size",e.moduleBodySelector=".t3js-module-body",e.customSelector=".t3js-preset-custom",e.customWidthSelector=".t3js-preset-custom",e.customHeightSelector=".t3js-preset-custom-height",e.changeOrientationSelector=".t3js-change-orientation",e.changePresetSelector=".t3js-change-preset",e.inputWidthSelector=".t3js-viewpage-input-width",e.inputHeightSelector=".t3js-viewpage-input-height",e.currentLabelSelector=".t3js-viewpage-current-label",e.topbarContainerSelector=".t3js-viewpage-topbar",e.refreshSelector=".t3js-viewpage-refresh"}(Selectors||(Selectors={}));class ViewPage{constructor(){this.defaultLabel="",this.minimalHeight=300,this.minimalWidth=300,this.storagePrefix="moduleData.web_ViewpageView.States.",this.queue=[],this.queueIsRunning=!1,$((()=>{const e=$(".t3js-preset-custom-label");this.defaultLabel=e.length>0?e.html().trim():"",this.$iframe=$("#tx_this_iframe"),this.$resizableContainer=$(Selectors.resizableContainerIdentifier),this.$sizeSelector=$(Selectors.sizeIdentifier),this.initialize()}))}static getCurrentWidth(){return $(Selectors.inputWidthSelector).val()}static getCurrentHeight(){return $(Selectors.inputHeightSelector).val()}static setLabel(e){$(Selectors.currentLabelSelector).html((new SecurityUtility).encodeHtml(e))}static getCurrentLabel(){return $(Selectors.currentLabelSelector).html().trim()}persistQueue(){if(!1===this.queueIsRunning&&this.queue.length>=1){this.queueIsRunning=!0;let e=this.queue.shift();PersistentStorage.set(e.storageIdentifier,e.data).done((()=>{this.queueIsRunning=!1,this.persistQueue()}))}}addToQueue(e,t){const i={storageIdentifier:e,data:t};this.queue.push(i),this.queue.length>=1&&this.persistQueue()}setSize(e,t){isNaN(t)&&(t=this.calculateContainerMaxHeight()),t<this.minimalHeight&&(t=this.minimalHeight),isNaN(e)&&(e=this.calculateContainerMaxWidth()),e<this.minimalWidth&&(e=this.minimalWidth),$(Selectors.inputWidthSelector).val(e),$(Selectors.inputHeightSelector).val(t),this.$resizableContainer.css({width:e,height:t,left:0})}persistCurrentPreset(){let e={width:ViewPage.getCurrentWidth(),height:ViewPage.getCurrentHeight(),label:ViewPage.getCurrentLabel()};this.addToQueue(this.storagePrefix+"current",e)}persistCustomPreset(){let e={width:ViewPage.getCurrentWidth(),height:ViewPage.getCurrentHeight()};$(Selectors.customSelector).data("width",e.width),$(Selectors.customSelector).data("height",e.height),$(Selectors.customWidthSelector).html(e.width),$(Selectors.customHeightSelector).html(e.height),this.addToQueue(this.storagePrefix+"custom",e)}persistCustomPresetAfterChange(){clearTimeout(this.queueDelayTimer),this.queueDelayTimer=window.setTimeout((()=>{this.persistCustomPreset()}),1e3)}initialize(){$(document).on("click",Selectors.changeOrientationSelector,(()=>{const e=$(Selectors.inputHeightSelector).val(),t=$(Selectors.inputWidthSelector).val();this.setSize(e,t),this.persistCurrentPreset()})),$(document).on("change",Selectors.inputWidthSelector,(()=>{const e=$(Selectors.inputWidthSelector).val(),t=$(Selectors.inputHeightSelector).val();this.setSize(e,t),ViewPage.setLabel(this.defaultLabel),this.persistCustomPresetAfterChange()})),$(document).on("change",Selectors.inputHeightSelector,(()=>{const e=$(Selectors.inputWidthSelector).val(),t=$(Selectors.inputHeightSelector).val();this.setSize(e,t),ViewPage.setLabel(this.defaultLabel),this.persistCustomPresetAfterChange()})),$(document).on("click",Selectors.changePresetSelector,(e=>{const t=$(e.currentTarget).data();this.setSize(parseInt(t.width,10),parseInt(t.height,10)),ViewPage.setLabel(t.label),this.persistCurrentPreset()})),$(document).on("click",Selectors.refreshSelector,(()=>{document.getElementById("tx_viewpage_iframe").contentWindow.location.reload()})),this.$resizableContainer.resizable({handles:"w, sw, s, se, e"}),this.$resizableContainer.on("resizestart",(e=>{$(e.currentTarget).append('<div id="viewpage-iframe-cover" style="z-index:99;position:absolute;width:100%;top:0;left:0;height:100%;"></div>')})),this.$resizableContainer.on("resize",((e,t)=>{t.size.width=t.originalSize.width+2*(t.size.width-t.originalSize.width),t.size.height<this.minimalHeight&&(t.size.height=this.minimalHeight),t.size.width<this.minimalWidth&&(t.size.width=this.minimalWidth),$(Selectors.inputWidthSelector).val(t.size.width),$(Selectors.inputHeightSelector).val(t.size.height),this.$resizableContainer.css({left:0}),ViewPage.setLabel(this.defaultLabel)})),this.$resizableContainer.on("resizestop",(()=>{$("#viewpage-iframe-cover").remove(),this.persistCurrentPreset(),this.persistCustomPreset()}))}calculateContainerMaxHeight(){this.$resizableContainer.hide();let e=$(Selectors.moduleBodySelector),t=e.outerHeight()-e.height(),i=$(document).height(),s=$(Selectors.topbarContainerSelector).outerHeight();return this.$resizableContainer.show(),i-t-s-8}calculateContainerMaxWidth(){this.$resizableContainer.hide();let e=$(Selectors.moduleBodySelector),t=e.outerWidth()-e.width(),i=$(document).width();return this.$resizableContainer.show(),parseInt(i-t+"",10)}}export default new ViewPage;