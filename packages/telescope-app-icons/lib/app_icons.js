var appIconProperty = {
  propertyName: 'appIcon',
  propertySchema: {
    type: String,
    optional: true
  }
}
addToPostSchema.push(appIconProperty);

postModules.push({
  template: 'postAppIcon', 
  position: 'center-left'
});
