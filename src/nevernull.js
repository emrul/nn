/**
 * Returns an object which allows for safe navigation of properties.
 * When raw property values are needed, simply execute the property as a function.
 *
 * e.g.
 * let nnObject = nn({ a: 1 });
 * nnObject.a() == 1
 * nnObject.non.existent.property.access() == undefined
 *
 * @param rawValue - object to be wrapped.
 * @returns {Proxy}
 */
export let nn = (rawValue)=>{

  //Each property accessed on a nevernull function-object will be this function.
  //e.g. nn({}).prop1 is a function, which when executed, returns the passed in rawValue.
  let wrappedValue = ()=>{
    return rawValue;
  };

  //intercept all property access on the wrappedValue function-object
  return new Proxy(wrappedValue, {

    /**
     * When a property is accessed, this function intercepts its access and instead returns a Proxy of a wrappedValue function.
     * This allows us to do lazy recursion on all nested properties.
     * @param target - object which is being asked for the property with the name of the 'name' parameter.
     * @param name - property name on the target who's value is needed.
     * @returns {Proxy} - recursive call to nevernull is returned so accessing nested properties is always safe.
     */
    get: function(target, name){
      //get the raw target so we can access the raw property value.
      let rawTarget = target();
      let rawPropertyValue = rawTarget ? rawTarget[name] : undefined;

      //function properties should maintain their context.
      if(typeof rawPropertyValue === 'function'){
        rawPropertyValue = rawPropertyValue.bind(rawTarget);
      }

      //ensure the property is never null.
      return nn(rawPropertyValue);
    }
  });
};