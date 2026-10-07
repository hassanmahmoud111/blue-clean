import { useEffect } from 'react';
import { FAST_PROTOTYPE_MODE } from '../config/prototype';

export default function PrototypeMode(){
  useEffect(()=>{
    if(!FAST_PROTOTYPE_MODE)return;
    const relaxForms=()=>document.querySelectorAll('form').forEach(form=>{form.noValidate=true;form.dataset.prototypeMode='true'});
    relaxForms();
    const observer=new MutationObserver(relaxForms);
    observer.observe(document.body,{childList:true,subtree:true});
    return()=>observer.disconnect();
  },[]);
  return null;
}
