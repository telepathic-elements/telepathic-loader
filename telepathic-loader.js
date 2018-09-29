import { importModule } from "https://uupaa.github.io/dynamic-import-polyfill/importModule.js";
//IIFE to try and load all *-element - class name must match SomethingElement while tag must match something-element
export default class TelepathicLoader{
    static async Load(dom){
        let nodeList = dom.querySelectorAll('*');
        for(let element of nodeList){
            if(element.tagName.includes('-ELEMENT')){
                let tagName = element.tagName.toLowerCase();
                //First see if there is already something in the custom element registry
                if(!window.customElements.get(tagName)){
                    let jsFileName = `${tagName}.js`;
                    
                    let classParts = tagName.split('-');
                    let className = "";
                    for(let part of classParts){
                        className += part.charAt(0).toUpperCase() + part.slice(1);
                    }
                   
                    window[tagName] = className;
                    let path = window.location.pathname.split('/');
                    path.pop();
                    path = path.join('/');
                    window[className] = path;
                    let jsLoc = `${path}/${tagName}/${jsFileName}`;
                    let module;
                    try{
                        console.log(`importing ${jsLoc}`);
                        module = await importModule(jsLoc);
                    }catch(err){
                        //module is probably remote
                        path = 'https://telepathic-elements.github.io';
                        jsLoc = `${path}/${tagName}/${jsFileName}`;
                        console.log(`importing ${jsLoc}`);
                        module = await importModule(jsLoc);
                    }
                    console.log(tagName+" module is ",module);
                    await window.customElements.define(tagName,module.default);
                }else{
                    console.log(`${tagName} already loaded, skipping!`);
                }
            }
        }
    }
}
window.TelepathicLoader = TelepathicLoader;  
TelepathicLoader.Load(document);