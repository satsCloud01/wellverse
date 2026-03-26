import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { C } from '../tokens'
import Section from '../components/Section'

export default function Blog() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getBlogPosts().then(setPosts).catch(() => setPosts([])).finally(() => setLoading(false))
  }, [])

  return (
    <div data-tour="blog" style={{ background: C.void }}>
      <Section bg={C.void}>
        <div className="mb-9">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3">✦  The WellVerse Journal</p>
          <h1 className="font-display font-normal text-parchment mb-3" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>
            Insights for the <em className="text-gold">intentional.</em>
          </h1>
          <p className="text-[15px] text-mist max-w-[520px]">Perspectives on self-investment from our guides and community.</p>
        </div>

        {loading ? (
          <p className="text-mist text-sm text-center py-16">Loading...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-mist">
            <div className="text-[42px] mb-3.5">✍️</div>
            <h3 className="font-display text-[26px] text-parchment mb-2.5">No posts yet</h3>
            <p className="text-sm">Check back soon for new articles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="rounded-[20px] p-6 cursor-pointer transition-all hover:brightness-110 flex flex-col"
                style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.08)' }}
              >
                <h3 className="font-display text-lg text-parchment mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-[13px] text-dust leading-relaxed line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium text-mist" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-mist">
                  <span>{post.author || 'WellVerse'}</span>
                  <span>&middot;</span>
                  <span>{post.published_at?.split('T')[0] || ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}
