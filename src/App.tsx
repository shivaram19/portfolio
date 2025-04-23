import NotionEmbed from './components/NotionEmbed';

function App() {
  return (
    <div className="App">
      <NotionEmbed 
        embedUrl="https://flossy-ease-a8c.notion.site/ebd/1ded35d51e99807c9135f8d6eb2a1b64"
        defaultHeight='100%'
        minHeight='100%'
        className="my-custom-notion-embed"
      />
    </div>
  );
}

export default App;
