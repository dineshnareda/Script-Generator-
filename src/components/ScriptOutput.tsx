import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Copy, 
  Check, 
  Hash, 
  Key, 
  Layout, 
  MessageCircle, 
  Type as TypeIcon, 
  Sparkles,
  Edit2,
  Save,
  X,
  RefreshCw,
  ArrowUp
} from 'lucide-react';
import { ScriptOutput as ScriptOutputType } from '../types';

interface ScriptOutputProps {
  output: ScriptOutputType;
  onUpdate: (updatedOutput: ScriptOutputType) => void;
  onRegenerate: () => void;
}

export default function ScriptOutput({ output, onUpdate, onRegenerate }: ScriptOutputProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScript, setEditedScript] = useState(output.script);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedScript(output.script);
    setIsEditing(false);
  }, [output]);

  const handleSave = () => {
    onUpdate({
      ...output,
      script: editedScript
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedScript(output.script);
    setIsEditing(false);
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const copyAll = () => {
    const allText = `
HOOK:
${output.hook}

SCRIPT:
${output.script}

TITLES:
${output.titles.join('\n')}

CTA:
${output.cta}

KEYWORDS:
${output.keywords.join(', ')}

HASHTAGS:
${output.hashtags.join(' ')}
    `.trim();
    copyToClipboard(allText, 'all');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const CopyButton = ({ text, section, label }: { text: string; section: string; label?: string }) => (
    <button
      onClick={() => copyToClipboard(text, section)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all font-bold text-xs ${
        copiedSection === section 
          ? 'bg-green-500 text-white' 
          : 'bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      {copiedSection === section ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {label || (copiedSection === section ? 'Copied!' : 'Copy')}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Hook Section */}
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <Sparkles className="w-5 h-5" />
            <span>THE HOOK</span>
          </div>
          <CopyButton text={output.hook} section="hook" />
        </div>
        <p className="text-xl font-bold text-slate-800 leading-relaxed italic">
          "{output.hook}"
        </p>
      </div>

      {/* Script Section */}
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <Layout className="w-5 h-5" />
            <span>FULL SCRIPT</span>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <CopyButton text={output.script} section="script" />
              </>
            )}
          </div>
        </div>
        <div className="relative">
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                ref={textareaRef}
                value={editedScript}
                onChange={(e) => setEditedScript(e.target.value)}
                className="w-full h-96 px-6 py-5 rounded-2xl border-2 border-indigo-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium text-slate-700 leading-relaxed resize-none bg-slate-50/50 transition-all"
                autoFocus
                placeholder="Edit your script here..."
              />
            </div>
          ) : (
            <div className="markdown-body text-slate-700 leading-relaxed font-medium p-2">
              <ReactMarkdown>{output.script}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* Titles Section */}
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <TypeIcon className="w-5 h-5" />
            <span>VIRAL TITLES</span>
          </div>
          <CopyButton text={output.titles.join('\n')} section="titles" />
        </div>
        <ul className="space-y-3">
          {output.titles.map((title, i) => (
            <li key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
              <div className="flex items-start gap-3 text-slate-700 font-semibold">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs">
                  {i + 1}
                </span>
                {title}
              </div>
              <button
                onClick={() => copyToClipboard(title, `title-${i}`)}
                className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-indigo-600"
              >
                {copiedSection === `title-${i}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Section */}
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <MessageCircle className="w-5 h-5" />
            <span>CALL TO ACTION</span>
          </div>
          <CopyButton text={output.cta} section="cta" />
        </div>
        <p className="text-slate-700 font-medium">
          {output.cta}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Keywords Section */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Key className="w-5 h-5" />
              <span>SEO KEYWORDS</span>
            </div>
            <CopyButton text={output.keywords.join(', ')} section="keywords" />
          </div>
          <div className="flex flex-wrap gap-2">
            {output.keywords.map((kw, i) => (
              <button
                key={i}
                onClick={() => copyToClipboard(kw, `kw-${i}`)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  copiedSection === `kw-${i}` ? 'bg-green-500 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Hashtags Section */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Hash className="w-5 h-5" />
              <span>HASHTAGS</span>
            </div>
            <CopyButton text={output.hashtags.join(' ')} section="hashtags" />
          </div>
          <div className="flex flex-wrap gap-2">
            {output.hashtags.map((tag, i) => (
              <button
                key={i}
                onClick={() => copyToClipboard(tag, `tag-${i}`)}
                className={`font-bold transition-all ${
                  copiedSection === `tag-${i}` ? 'text-green-500' : 'text-indigo-500 hover:text-indigo-600'
                }`}
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-8 border-t border-slate-100">
        <button
          onClick={onRegenerate}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
        >
          <RefreshCw className="w-5 h-5" />
          REGENERATE
        </button>
        <button
          onClick={copyAll}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all shadow-xl ${
            copiedSection === 'all' 
              ? 'bg-green-500 text-white shadow-green-500/20' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
          }`}
        >
          {copiedSection === 'all' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {copiedSection === 'all' ? 'COPIED ALL!' : 'COPY ALL'}
        </button>
        <button
          onClick={scrollToTop}
          className="p-4 bg-white text-slate-400 rounded-2xl border border-slate-100 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-lg"
          title="Scroll to Top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
}
