import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { C } from '../tokens'
import Section from '../components/Section'
import Divider from '../components/Divider'

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getBlogPost(slug)
      .then(setPost)
      .catch((err) => setError(err.message || 'Post not found'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.void }}>
        <p className="text-mist text-sm">Loading...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div style={{ background: C.void }}>
        <Section bg={C.void}>
          <button onClick={() => navigate('/blog')} className="text-[13px] text-amber cursor-pointer bg-transparent border-none font-body mb-6">← Back to Blog</button>
          <div className="text-center py-20">
            <h3 className="font-display text-[26px] text-parchment mb-2.5">Post not found</h3>
            <p className="text-sm text-mist">{error}</p>
          </div>
        </Section>
      </div>
    )
  }

  return (
    <div style={{ background: C.void }}>
      <Section bg={C.void}>
        <button onClick={() => navigate('/blog')} className="text-[13px] text-amber cursor-pointer bg-transparent border-none font-body mb-6">← Back to Blog</button>
        <div className="max-w-[720px]">
          <h1 className="font-display font-normal text-parchment mb-3" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-mist mb-4">
            <span>{post.author || 'WellVerse'}</span>
            <span>&middot;</span>
            <span>{post.published_at?.split('T')[0] || ''}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-5">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-0.5 rounded-full text-[10px] font-medium text-mist" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          <Divider />
          <div className="mt-6 text-[15px] text-dust leading-[1.9]">
            {(post.body || '').split('\n').map((line, i) => {
              if (line.startsWith('### ')) return <h3 key={i} className="font-display text-lg text-parchment mt-6 mb-2">{line.slice(4)}</h3>
              if (line.startsWith('## ')) return <h2 key={i} className="font-display text-xl text-parchment mt-7 mb-3">{line.slice(3)}</h2>
              if (line.startsWith('# ')) return <h1 key={i} className="font-display text-2xl text-parchment mt-8 mb-3">{line.slice(2)}</h1>
              if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1">{line.slice(2)}</li>
              if (line.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-amber/40 pl-4 italic text-mist my-3">{line.slice(2)}</blockquote>
              if (!line.trim()) return <br key={i} />
              return <p key={i} className="mb-2">{line}</p>
            })}
          </div>
        </div>
      </Section>
    </div>
  )
}
