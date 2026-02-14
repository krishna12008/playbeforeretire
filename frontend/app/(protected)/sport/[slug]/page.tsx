export default function SportPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold capitalize">
        {params.slug} Page
      </h1>
    </div>
  )
}
