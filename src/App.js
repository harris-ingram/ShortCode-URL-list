// import logo from './logo.svg';
// import './App.css';
import './Resp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import $ from 'jquery';
import { useState, useReducer } from 'react';
import { useCookies } from 'react-cookie';
import { CopyToClipboard } from 'react-copy-to-clipboard';
function ListUrls(props) {
  if (props.urls.length > 0) {
    const revUrls = props.urls.slice().reverse();
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Original</th>
            <th scope="col">Short URLs</th>
          </tr>
        </thead>
        <tbody>
          {revUrls.map((urlSet, i) => (
            <tr key={urlSet.code}>
              
              <td data-title={" Original"}>{urlSet.original_link}</td>
              <td data-title="Short URLs">
                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex py-1 align-items-center">
                    {urlSet.share_link}
                    <div className='btn-group ms-auto ps-1'>
                      <a className='btn btn-primary' href={urlSet.full_share_link}><i className="bi bi-box-arrow-up-right"></i></a>
                      <CopyToClipboard text={urlSet.full_share_link}><button className='btn btn-outline-primary'><i className="bi bi-clipboard"></i></button></CopyToClipboard>
                    </div>
                  </div>
                  <div className="list-group-item d-flex py-1 align-items-center">
                    {urlSet.short_link}
                    <div className='btn-group ms-auto ps-1'>
                      <a className='btn btn-primary' href={urlSet.full_short_link}><i className="bi bi-box-arrow-up-right"></i></a>
                      <CopyToClipboard text={urlSet.full_short_link}><button className='btn btn-outline-primary'><i className="bi bi-clipboard"></i></button></CopyToClipboard>
                    </div>
                  </div>
                  <div className="list-group-item d-flex py-1 align-items-center">
                    {urlSet.short_link2}
                    <div className='btn-group ms-auto ps-1'>
                      <a className='btn btn-primary' href={urlSet.full_short_link2}><i className="bi bi-box-arrow-up-right"></i></a>
                      <CopyToClipboard text={urlSet.full_short_link}><button className='btn btn-outline-primary'><i className="bi bi-clipboard"></i></button></CopyToClipboard>
                    </div>
                  </div>
                  <div className="list-group-item d-flex py-1 align-items-center">
                    {urlSet.short_link3}
                    <div className='btn-group ms-auto ps-1'>
                      <a className='btn btn-primary' href={urlSet.full_short_link3}><i className="bi bi-box-arrow-up-right"></i></a>
                      <CopyToClipboard text={urlSet.full_short_link}><button className='btn btn-outline-primary'><i className="bi bi-clipboard"></i></button></CopyToClipboard>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    );
  }
  return (
    <></>
  );
}

function App() {
  const [findUrl, setUrl] = useState('');
  const [valid, setValid] = useState(true);
  const [message, setMessage] = useState('');

  const [cookies, setCookie] = useCookies();
  function reducer(state, action) {
    let out = [...state, action.data];
    setCookie('urlSets', out, { path: '/', sameSite: true });
    return out;
  }
  console.log({ originalCookie: cookies });
  const [urlSets, setUrlSet] = useReducer(reducer,
    cookies['urlSets'] !== undefined ? cookies['urlSets'] : []
  );
  const handleChange = event => {
    setUrl(event.target.value);

    console.log('value is:', event.target.value);
  };
  const handleSubmit = event => {
    event.preventDefault();
    $.ajax({
      url: "https://api.shrtco.de/v2/shorten",
      data: { url: findUrl }
    }).done(function (response) {
      setUrlSet({ data: response.result });
      console && console.log({
        urlSets: urlSets,
        done: response
      });
      setValid(true);
      setMessage('');
    })
      .fail(function (jqXHR, response) {
        console && console.log({ responseJSON: jqXHR.responseJSON, fail: response });
        setValid(false);
        setMessage(jqXHR.responseJSON.error);
      });

    // 
    console.log('handleClick >', findUrl);
  };
  return (
    <div className="App container-sm p-3 p-sm-5">
      <h1>URL Shortener</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <div className="form-floating position-relative">
            <input type="text" className={valid ? 'form-control' : 'form-control is-invalid'} id="longUrl" placeholder="Username" onChange={handleChange} value={findUrl} autoComplete="off" />
            <div className="invalid-feedback position-absolute top-100 start-0">
              {message}
            </div>
            <label htmlFor="longUrl">Enter URL to Minify</label>
          </div>

          <button className="btn btn-secondary" type="submit" id="button-addon2"  >Minify</button>
        </div>
      </form>
      <ListUrls urls={urlSets} />
    </div>
  );
}

export default App;
