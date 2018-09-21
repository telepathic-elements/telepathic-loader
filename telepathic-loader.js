//IIFE to try and load all *-element - class name must match SomethingElement while tag must match something-element
export default class TelepathicLoader{
    static async Load(dom){
        let nodeList = dom.querySelectorAll('*');
        nodeList.forEach(async (element)=>{
            if(element.tagName.includes('-ELEMENT')){
                let tagName = element.tagName.toLowerCase();
                let jsFileName = `${tagName}.js`;
                let htmlFileName = `${tagName}.html`;
                let classParts = tagName.split('-');
                let className = "";
                classParts.forEach((part)=>{
                    className += part.charAt(0).toUpperCase() + part.slice(1);
                });
    
                //First see if there is already something in the custom element registry
                if(!window.customElements.get(tagName)){
                    //console.log(`${tagName} : ${className} is ${fileName}`);
                    //console.log(`${tagName} is unregistered`);
                    //Try to instantiate
                    let path = window.location.pathname.split('/');
                    path.pop();
                    path = path.join('/');
                    let jsloc = `${path}/${tagName}/${jsFileName}`;
                    let htmlLoc = `${path}/${tagName}/${htmlFileName}`;
                    window[className] = htmlLoc;
                    window[tagName] = className;
                    console.log(`importing ${jsloc}`);
                    let module = await import(jsloc);
                   
                    //console.log(tagName+" module is ",module);
                    try{
                        window.customElements.define(tagName,module.default);
                    }catch(err){
                        console.error(`${tagName} : ${err}`);
                    }
                    //import {className} from ;
                    //window.customElements.define(tagName,this[className]);
                }else{
                    console.log(`${tagName} already loaded, skipping!`);
                }
            }
        });
    }
}
window.TelepathicLoader = TelepathicLoader;  
TelepathicLoader.Load(document);