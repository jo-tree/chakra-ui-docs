import { MDXComponents } from 'components/mdx-components'
import { allGuides } from 'contentlayer/generated'
import Layout from 'layouts'
import { GetStaticPaths, InferGetStaticPropsType } from 'next'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { toArray } from 'utils/js-utils'

export default function Page({
  guide,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Component = useMDXComponent(guide.body.code)
  return (
    <Layout frontMatter={guide.frontMatter}>
      <Component components={MDXComponents} />
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const guides = allGuides
    .map((t) => t._id.replace('guides/', '').replace('.mdx', ''))
    .map((id) => ({ params: { slug: id.split('/') } }))
  return { paths: guides, fallback: false }
}

export const getStaticProps = async (ctx) => {
  const params = toArray(ctx.params.slug)
  const guide = allGuides.find((guide) =>
    guide._id.endsWith(`${params.join('/')}.mdx`),
  )
  return { props: { guide } }
}
