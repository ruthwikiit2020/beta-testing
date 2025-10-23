import React from 'react';

interface MarkdownRendererProps {
  text: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text, className = '' }) => {
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, lineIndex) => {
      // Skip empty lines
      if (line.trim() === '') {
        return <br key={lineIndex} />;
      }

      // Enhanced markdown parsing with emoji support
      const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|:[a-z_]+:|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu);
      
      return (
        <p key={lineIndex} className="mb-2 last:mb-0">
          {parts.map((part, partIndex) => {
            // Bold text: **text**
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIndex} className="font-bold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            // Italic text: *text*
            if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
              return (
                <em key={partIndex} className="italic">
                  {part.slice(1, -1)}
                </em>
              );
            }
            // Inline code: `code`
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code key={partIndex} className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm font-mono">
                  {part.slice(1, -1)}
                </code>
              );
            }
            // Emoji shortcodes: :smile:, :thinking:, etc.
            if (part.startsWith(':') && part.endsWith(':')) {
              const emojiCode = part.slice(1, -1);
              const emojiMap: { [key: string]: string } = {
                'smile': '😊',
                'thinking': '🤔',
                'thumbsup': '👍',
                'thumbsdown': '👎',
                'clap': '👏',
                'fire': '🔥',
                'star': '⭐',
                'check': '✅',
                'cross': '❌',
                'warning': '⚠️',
                'lightbulb': '💡',
                'rocket': '🚀',
                'book': '📚',
                'brain': '🧠',
                'heart': '❤️',
                'party': '🎉',
                'confused': '😕',
                'excited': '🤩',
                'cool': '😎',
                'wink': '😉',
                'laugh': '😂',
                'cry': '😢',
                'angry': '😠',
                'surprised': '😲',
                'sleepy': '😴',
                'nerd': '🤓',
                'hug': '🤗',
                'pray': '🙏',
                'muscle': '💪',
                'eyes': '👀',
                'ear': '👂',
                'nose': '👃',
                'mouth': '👄',
                'tongue': '👅',
                'hand': '✋',
                'point': '👉',
                'wave': '👋',
                'ok': '👌',
                'peace': '✌️',
                'love': '💕',
                'kiss': '💋',
                'rose': '🌹',
                'tulip': '🌷',
                'sunflower': '🌻',
                'cherry': '🍒',
                'strawberry': '🍓',
                'peach': '🍑',
                'apple': '🍎',
                'banana': '🍌',
                'grapes': '🍇',
                'watermelon': '🍉',
                'pizza': '🍕',
                'hamburger': '🍔',
                'coffee': '☕',
                'tea': '🍵',
                'beer': '🍺',
                'wine': '🍷',
                'cake': '🍰',
                'cookie': '🍪',
                'candy': '🍬',
                'lollipop': '🍭',
                'ice_cream': '🍦',
                'doughnut': '🍩',
                'popcorn': '🍿',
                'birthday': '🎂',
                'gift': '🎁',
                'balloon': '🎈',
                'confetti': '🎊',
                'tada': '🎉',
                'sparkles': '✨',
                'star2': '🌟',
                'dizzy': '💫',
                'boom': '💥',
                'collision': '💥',
                'sweat_drops': '💦',
                'dash': '💨',
                'hole': '🕳️',
                'bomb': '💣',
                'speech_balloon': '💬',
                'thought_balloon': '💭',
                'zzz': '💤',
                'anger': '💢',
                'sweat': '😓',
                'dizzy_face': '😵',
                'exploding_head': '🤯',
                'cowboy_hat_face': '🤠',
                'hugs': '🤗',
                'handshake': '🤝',
                'nail_care': '💅',
                'selfie': '🤳',
                'mechanical_arm': '🦾',
                'mechanical_leg': '🦿',
                'leg': '🦵',
                'foot': '🦶',
                'tooth': '🦷',
                'bone': '🦴',
                'eye': '👁️',
                'lips': '👄',
                'baby': '👶',
                'child': '🧒',
                'boy': '👦',
                'girl': '👧',
                'adult': '🧑',
                'man': '👨',
                'woman': '👩',
                'older_adult': '🧓',
                'older_man': '👴',
                'older_woman': '👵',
                'person_frowning': '🙍',
                'person_pouting': '🙎',
                'person_gesturing_no': '🙅',
                'person_gesturing_ok': '🙆',
                'person_tipping_hand': '💁',
                'person_raising_hand': '🙋',
                'deaf_person': '🧏',
                'person_bowing': '🙇',
                'person_facepalming': '🤦',
                'person_shrugging': '🤷',
                'health_worker': '🧑‍⚕️',
                'student': '🧑‍🎓',
                'teacher': '🧑‍🏫',
                'judge': '🧑‍⚖️',
                'farmer': '🧑‍🌾',
                'cook': '🧑‍🍳',
                'mechanic': '🧑‍🔧',
                'factory_worker': '🧑‍🏭',
                'office_worker': '🧑‍💼',
                'scientist': '🧑‍🔬',
                'technologist': '🧑‍💻',
                'singer': '🧑‍🎤',
                'artist': '🧑‍🎨',
                'pilot': '🧑‍✈️',
                'astronaut': '🧑‍🚀',
                'firefighter': '🧑‍🚒',
                'police_officer': '👮',
                'detective': '🕵️',
                'guard': '💂',
                'ninja': '🥷',
                'construction_worker': '👷',
                'prince': '🤴',
                'princess': '👸',
                'person_with_turban': '👳',
                'person_with_skullcap': '👲',
                'woman_with_headscarf': '🧕',
                'person_in_tuxedo': '🤵',
                'person_with_veil': '👰',
                'pregnant_woman': '🤰',
                'breast_feeding': '🤱',
                'woman_feeding_baby': '👩‍🍼',
                'man_feeding_baby': '👨‍🍼',
                'person_feeding_baby': '🧑‍🍼',
                'angel': '👼',
                'santa': '🎅',
                'mrs_claus': '🤶',
                'mx_claus': '🧑‍🎄',
                'superhero': '🦸',
                'supervillain': '🦹',
                'mage': '🧙',
                'fairy': '🧚',
                'vampire': '🧛',
                'zombie': '🧟',
                'elf': '🧝',
                'genie': '🧞',
                'merperson': '🧜',
                'elf_man': '🧝‍♂️',
                'elf_woman': '🧝‍♀️',
                'vampire_man': '🧛‍♂️',
                'vampire_woman': '🧛‍♀️',
                'zombie_man': '🧟‍♂️',
                'zombie_woman': '🧟‍♀️',
                'genie_man': '🧞‍♂️',
                'genie_woman': '🧞‍♀️',
                'merperson_man': '🧜‍♂️',
                'merperson_woman': '🧜‍♀️',
                'fairy_man': '🧚‍♂️',
                'fairy_woman': '🧚‍♀️',
                'angel_man': '👼‍♂️',
                'angel_woman': '👼‍♀️',
                'mage_man': '🧙‍♂️',
                'mage_woman': '🧙‍♀️',
                'superhero_man': '🦸‍♂️',
                'superhero_woman': '🦸‍♀️',
                'supervillain_man': '🦹‍♂️',
                'supervillain_woman': '🦹‍♀️',
                'santa_man': '🎅‍♂️',
                'santa_woman': '🎅‍♀️',
                'mrs_claus_man': '🤶‍♂️',
                'mrs_claus_woman': '🤶‍♀️',
                'mx_claus_man': '🧑‍🎄‍♂️',
                'mx_claus_woman': '🧑‍🎄‍♀️'
              };
              
              return (
                <span key={partIndex} className="inline-block text-lg">
                  {emojiMap[emojiCode] || part}
                </span>
              );
            }
            // Regular emojis (already rendered)
            if (/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(part)) {
              return (
                <span key={partIndex} className="inline-block text-lg">
                  {part}
                </span>
              );
            }
            return <span key={partIndex}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      {renderMarkdown(text)}
    </div>
  );
};

export default MarkdownRenderer;
