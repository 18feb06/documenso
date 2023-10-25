export default function ApiDocs() {
  const docsUi = `<redoc spec-url="/openapi.json" expand-responses='200,201'>
  <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
</redoc>
<script>
  const redoc = Redoc.init('/openapi.json', {
    theme: {
      rightPanel: {
        backgroundColor: '#2A873A',
        width: '35%',
      },
      sidebar: {
        width: '230px',
      },
    },
  });
</script>`;

  return (
    <div dangerouslySetInnerHTML={{ __html: docsUi }} style={{ backgroundColor: 'white' }}></div>
  );
}
