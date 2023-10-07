const API_TOKEN = 'dc778109457640bab9b0267313c8f2f4';

export function addPerson(
  name: string,
  image: File,
  collections: any,
  callback: (v: any) => void
) {
  const headers = {
    token: API_TOKEN
  };

  var formdata = new FormData();
  formdata.append('name', name);

  // if (typeof image == "string" && image.indexOf("https://") == 0)
  //   formdata.append("photos", image);
  // else formdata.append("photos", image, "file");

  const files = {
    photos: image
  };

  formdata.append('photos', files.photos);

  formdata.append('store', '1');
  formdata.append('collections', collections);

  var requestOptions = {
    method: 'POST',
    headers: headers,
    body: formdata
  };

  fetch('https://api.luxand.cloud/v2/person', requestOptions)
    .then((response) => response.json())
    .then((result) => callback(result))
    .catch((error) => console.log('error', error));
}

export function recognize(image: any, callback: (v: any) => void) {
  const headers = {
    token: API_TOKEN
  };

  var formdata = new FormData();

  if (typeof image == 'string' && image.indexOf('https://') == 0)
    formdata.append('photo', image);
  else formdata.append('photo', image, 'file');

  var requestOptions = {
    method: 'POST',
    headers: headers,
    body: formdata
  };

  fetch('https://api.luxand.cloud/photo/search/v2', requestOptions)
    .then((response) => response.json())
    .then((result) => callback(result))
    .catch((error) => console.log('error', error));
}
