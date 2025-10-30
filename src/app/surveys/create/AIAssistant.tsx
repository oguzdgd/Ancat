'use client'

import { useState } from 'react'
import { Question, QuestionType } from './SurveyCreator'

interface AIAssistantProps {
  onGenerate: (questions: Question[]) => void
  onClose: () => void
}

export default function AIAssistant({ onGenerate, onClose }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const parseAIPrompt = (text: string): Question[] => {
    const questions: Question[] = []
    const lines = text.toLowerCase()

    // Basit AI simülasyonu - gerçekte bir AI API kullanılabilir
    const patterns = [
      { regex: /(\d+)\s*(soru|adet)?\s*çoktan\s*seçmeli/i, type: 'multiple_choice' as QuestionType, count: true },
      { regex: /(\d+)\s*(soru|adet)?\s*onay\s*kutu/i, type: 'checkbox' as QuestionType, count: true },
      { regex: /(\d+)\s*(soru|adet)?\s*kısa\s*yanıt/i, type: 'short_answer' as QuestionType, count: true },
      { regex: /(\d+)\s*(soru|adet)?\s*(paragraf|uzun)/i, type: 'paragraph' as QuestionType, count: true },
      { regex: /(\d+)\s*(soru|adet)?\s*(puan|yıldız|rating)/i, type: 'rating' as QuestionType, count: true },
      { regex: /(\d+)\s*(soru|adet)?\s*ölçek/i, type: 'linear_scale' as QuestionType, count: true },
      { regex: /(\d+)\s*(soru|adet)?\s*açılır/i, type: 'dropdown' as QuestionType, count: true },
    ]

    patterns.forEach(({ regex, type, count }) => {
      const match = text.match(regex)
      if (match && count) {
        const questionCount = parseInt(match[1])
        for (let i = 0; i < questionCount; i++) {
          questions.push(createQuestionTemplate(type, i + 1))
        }
      }
    })

    // Eğer hiç pattern eşleşmezse, genel bir anket şablonu oluştur
    if (questions.length === 0 && text.trim()) {
      questions.push(
        createQuestionTemplate('multiple_choice', 1),
        createQuestionTemplate('rating', 2),
        createQuestionTemplate('paragraph', 3)
      )
    }

    return questions
  }

  const createQuestionTemplate = (type: QuestionType, index: number): Question => {
    const templates = {
      multiple_choice: {
        title: `Soru ${index}: Aşağıdakilerden hangisi sizin için geçerlidir?`,
        options: ['Seçenek A', 'Seçenek B', 'Seçenek C', 'Seçenek D']
      },
      checkbox: {
        title: `Soru ${index}: Aşağıdakilerden hangilerini seçersiniz? (Birden fazla seçilebilir)`,
        options: ['Seçenek 1', 'Seçenek 2', 'Seçenek 3', 'Seçenek 4']
      },
      short_answer: {
        title: `Soru ${index}: Kısa bir cevap yazınız`,
      },
      paragraph: {
        title: `Soru ${index}: Düşüncelerinizi detaylı olarak paylaşın`,
      },
      rating: {
        title: `Soru ${index}: Deneyiminizi 1-5 arasında puanlayın`,
        minValue: 1,
        maxValue: 5
      },
      linear_scale: {
        title: `Soru ${index}: Aşağıdaki ifadeye ne kadar katılıyorsunuz?`,
        minValue: 1,
        maxValue: 10,
        minLabel: 'Hiç katılmıyorum',
        maxLabel: 'Tamamen katılıyorum'
      },
      dropdown: {
        title: `Soru ${index}: Listeden bir seçenek seçiniz`,
        options: ['Seçenek 1', 'Seçenek 2', 'Seçenek 3']
      }
    }

    return {
      id: `q-${Date.now()}-${index}`,
      type,
      required: false,
      ...templates[type]
    } as Question
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    // Simüle edilmiş AI gecikmesi
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const generatedQuestions = parseAIPrompt(prompt)
    onGenerate(generatedQuestions)
    setPrompt('')
    setIsGenerating(false)
  }

  const quickTemplates = [
    {
      title: 'Müşteri Memnuniyeti',
      prompt: '3 çoktan seçmeli, 1 puan, 1 paragraf'
    },
    {
      title: 'Ürün Geri Bildirimi',
      prompt: '2 çoktan seçmeli, 2 onay kutusu, 1 yıldız, 1 kısa yanıt'
    },
    {
      title: 'Etkinlik Değerlendirme',
      prompt: '4 ölçek, 2 çoktan seçmeli, 1 paragraf'
    }
  ]

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">✨</span>
            AI Asistan
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Anketinizi AI ile kolayca oluşturun
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Ne tür sorular oluşturmak istersiniz?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Örnek: 3 çoktan seçmeli, 1 onay kutusu, 1 puan sorusu oluştur"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none bg-white dark:bg-gray-800"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Oluşturuluyor...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Soruları Oluştur
            </>
          )}
        </button>

        {/* Quick Templates */}
        <div>
          <h3 className="text-sm font-medium mb-3">Hızlı Şablonlar</h3>
          <div className="space-y-2">
            {quickTemplates.map((template) => (
              <button
                key={template.title}
                onClick={() => setPrompt(template.prompt)}
                className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <p className="font-medium text-sm mb-1">{template.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{template.prompt}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <span>💡</span>
            İpuçları
          </h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• "5 çoktan seçmeli soru oluştur"</li>
            <li>• "3 onay kutusu ve 2 yıldız puanlama"</li>
            <li>• "Müşteri anketi için sorular"</li>
            <li>• "1-10 arası ölçek sorusu"</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
