import { useEffect, useState } from 'react'

// AI / ML / Neural Network code snippets
const SNIPPETS = [
  {
    lang: 'python',
    label: 'model.py',
    color: '#a78bfa',
    code: [
      'class NeuralNet(nn.Module):',
      '  def __init__(self):',
      '    super().__init__()',
      '    self.fc1 = nn.Linear(784, 256)',
      '    self.fc2 = nn.Linear(256, 10)',
      '  def forward(self, x):',
      '    x = F.relu(self.fc1(x))',
      '    return self.fc2(x)',
    ],
  },
  {
    lang: 'python',
    label: 'train.py',
    color: '#34d399',
    code: [
      'for epoch in range(epochs):',
      '  optimizer.zero_grad()',
      '  output = model(X_train)',
      '  loss = criterion(output, y)',
      '  loss.backward()',
      '  optimizer.step()',
    ],
  },
  {
    lang: 'python',
    label: 'attention.py',
    color: '#60a5fa',
    code: [
      'def attention(Q, K, V):',
      '  d_k = Q.size(-1)',
      '  scores = Q @ K.T',
      '  scores /= math.sqrt(d_k)',
      '  weights = F.softmax(scores)',
      '  return weights @ V',
    ],
  },
  {
    lang: 'python',
    label: 'backprop.py',
    color: '#f59e0b',
    code: [
      '# Gradient descent',
      'dW = (1/m) * X.T @ dZ',
      'db = (1/m) * np.sum(dZ)',
      'W -= learning_rate * dW',
      'b -= learning_rate * db',
    ],
  },
  {
    lang: 'python',
    label: 'transformer.py',
    color: '#f472b6',
    code: [
      'class MultiHeadAttention:',
      '  heads = 8',
      '  d_model = 512',
      '  d_k = d_model // heads',
      '',
      '  def split_heads(self, x):',
      '    return x.view(*x.shape[:-1],',
      '      self.heads, self.d_k)',
    ],
  },
  {
    lang: 'python',
    label: 'embeddings.py',
    color: '#34d399',
    code: [
      'embeddings = OpenAIEmbeddings()',
      'vectorstore = FAISS.from_texts(',
      '  texts=chunks,',
      '  embedding=embeddings',
      ')',
      'retriever = vectorstore',
      '  .as_retriever(k=4)',
    ],
  },
  {
    lang: 'python',
    label: 'activation.py',
    color: '#a78bfa',
    code: [
      '# ReLU & variants',
      'relu    = lambda x: max(0, x)',
      'leaky   = lambda x: x if x>0',
      '              else 0.01*x',
      'sigmoid = lambda x:',
      '  1 / (1 + np.exp(-x))',
      'tanh    = np.tanh',
    ],
  },
  {
    lang: 'python',
    label: 'langchain.py',
    color: '#60a5fa',
    code: [
      'chain = (',
      '  {"context": retriever,',
      '   "question": RunnablePass()}',
      '  | prompt',
      '  | llm',
      '  | StrOutputParser()',
      ')',
    ],
  },
  {
    lang: 'python',
    label: 'conv.py',
    color: '#f59e0b',
    code: [
      'self.conv = nn.Sequential(',
      '  nn.Conv2d(1, 32, 3, padding=1),',
      '  nn.BatchNorm2d(32),',
      '  nn.ReLU(),',
      '  nn.MaxPool2d(2),',
      '  nn.Dropout(0.25)',
      ')',
    ],
  },
  {
    lang: 'python',
    label: 'loss.py',
    color: '#f472b6',
    code: [
      '# Cross-entropy loss',
      'def cross_entropy(y_hat, y):',
      '  log_p = np.log(y_hat + 1e-9)',
      '  return -np.sum(',
      '    y * log_p',
      '  ) / len(y)',
    ],
  },
]

// Two well-separated slots — top-right and bottom-left (never overlap)
const SLOT_A = { top: '6%',    right: '1%' }
const SLOT_B = { bottom: '6%', left:  '1%' }
const SLOTS  = [SLOT_A, SLOT_B]

function CodeWindow({ snippet, pos, onDone }) {
  const [phase, setPhase] = useState('in')  // in | visible | out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('visible'), 50)
    const t2 = setTimeout(() => setPhase('out'), 4200)
    const t3 = setTimeout(() => onDone(), 4900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const opacity   = phase === 'in' ? 0 : phase === 'visible' ? 1 : 0
  const translateY = phase === 'in' ? 10 : phase === 'visible' ? 0 : -8

  return (
    <div style={{
      position: 'absolute',
      ...pos,
      opacity,
      transform: `translateY(${translateY}px)`,
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      zIndex: 3,
      pointerEvents: 'none',
      maxWidth: 260,
    }}>
      {/* Terminal window chrome */}
      <div style={{
        background: 'rgba(2,5,16,0.88)',
        border: `1px solid ${snippet.color}28`,
        borderRadius: 8,
        overflow: 'hidden',
        backdropFilter: 'blur(6px)',
        boxShadow: `0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px ${snippet.color}15`,
      }}>
        {/* Title bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 10px',
          background: `${snippet.color}0d`,
          borderBottom: `1px solid ${snippet.color}18`,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', opacity: 0.7 }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', opacity: 0.7 }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', opacity: 0.7 }} />
          <span style={{
            fontFamily: 'monospace', fontSize: 9,
            color: snippet.color, opacity: 0.7,
            marginLeft: 4, letterSpacing: '0.08em',
          }}>
            {snippet.label}
          </span>
        </div>

        {/* Code body */}
        <div style={{ padding: '8px 12px' }}>
          {snippet.code.map((line, i) => (
            <div key={i} style={{
              fontFamily: 'monospace', fontSize: 10,
              lineHeight: 1.7, whiteSpace: 'pre',
              color: colorize(line, snippet.color),
              opacity: line === '' ? 1 : undefined,
            }}>
              {line || '\u00A0'}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Very simple syntax colorizer
function colorize(line, accent) {
  if (line.startsWith('#')) return '#475569'       // comment
  if (line.startsWith('class ') || line.startsWith('def '))
    return accent                                   // keyword
  if (line.includes('=') && !line.includes('=='))
    return '#94a3b8'                               // assignment
  return '#64748b'                                 // default
}

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

// Each fixed slot cycles its own snippet independently — no overlap possible
function SlotWindow({ pos }) {
  const [key,     setKey]     = useState(0)
  const [snippet, setSnippet] = useState(
    () => SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]
  )

  function cycle() {
    let next
    do { next = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)] }
    while (next === snippet)
    setSnippet(next)
    setKey(k => k + 1)
  }

  return <CodeWindow key={key} snippet={snippet} pos={pos} onDone={cycle} />
}

export default function FloatingCode() {
  if (isMobile) return null

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}>
      {SLOTS.map((pos, i) => <SlotWindow key={i} pos={pos} />)}
    </div>
  )
}
