import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from '../components/common/StarryBackground';

interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  emoji: string;
  dates: string;
}

interface FortuneData {
  sign: ZodiacSign;
  rank: number;
  score: number;
  fortune: string;
  color: string;
}

const zodiacSigns: ZodiacSign[] = [
  { id: 'aries', name: '양자리', symbol: '♈', emoji: '🐏', dates: '3/21-4/19' },
  { id: 'taurus', name: '황소자리', symbol: '♉', emoji: '🐂', dates: '4/20-5/20' },
  { id: 'gemini', name: '쌍둥이자리', symbol: '♊', emoji: '👭', dates: '5/21-6/20' },
  { id: 'cancer', name: '게자리', symbol: '♋', emoji: '🦀', dates: '6/21-7/22' },
  { id: 'leo', name: '사자자리', symbol: '♌', emoji: '🦁', dates: '7/23-8/22' },
  { id: 'virgo', name: '처녀자리', symbol: '♍', emoji: '👸', dates: '8/23-9/22' },
  { id: 'libra', name: '천칭자리', symbol: '♎', emoji: '⚖️', dates: '9/23-10/22' },
  { id: 'scorpio', name: '전갈자리', symbol: '♏', emoji: '🦂', dates: '10/23-11/21' },
  { id: 'sagittarius', name: '사수자리', symbol: '♐', emoji: '🏹', dates: '11/22-12/21' },
  { id: 'capricorn', name: '염소자리', symbol: '♑', emoji: '🐐', dates: '12/22-1/19' },
  { id: 'aquarius', name: '물병자리', symbol: '♒', emoji: '🏺', dates: '1/20-2/18' },
  { id: 'pisces', name: '물고기자리', symbol: '♓', emoji: '🐟', dates: '2/19-3/20' }
];

const fortuneMessages = {
  aries: [
    "새로운 도전에 대한 용기가 빛을 발하는 날입니다. 적극적인 자세로 기회를 잡아보세요. 오늘 하루 당신의 에너지가 주변을 밝게 만들 것입니다.",
    "리더십을 발휘할 절호의 기회가 찾아옵니다. 주저하지 말고 앞장서세요. 당신의 결단력이 좋은 결과를 가져다줄 것입니다.",
    "조금 더 신중한 접근이 필요한 시기입니다. 성급한 판단보다는 차분히 상황을 살펴보세요. 인내심이 더 큰 성과를 가져다줄 것입니다."
  ],
  taurus: [
    "안정적인 기반 위에서 확실한 성과를 거둘 수 있는 날입니다. 꾸준함이 빛을 발하는 시기이니 현재의 노력을 지속하세요. 물질적 풍요로움도 기대해볼 수 있습니다.",
    "감각적인 즐거움을 만끽할 수 있는 하루가 될 것입니다. 맛있는 음식이나 아름다운 것들이 당신에게 특별한 행복을 선사할 것입니다.",
    "변화에 대한 두려움을 내려놓고 새로운 시도를 해보세요. 고집을 조금 누그러뜨리면 예상치 못한 좋은 기회를 만날 수 있습니다."
  ],
  gemini: [
    "소통과 네트워킹이 빛을 발하는 날입니다. 다양한 사람들과의 만남에서 새로운 아이디어와 기회를 발견할 수 있을 것입니다. 호기심을 마음껏 발휘하세요.",
    "정보 수집과 학습에 매우 유리한 시기입니다. 새로운 지식이나 기술을 익히기에 좋은 날이니 적극적으로 도전해보세요.",
    "너무 많은 일을 동시에 처리하려 하지 마세요. 집중력을 한 곳에 모으면 더 좋은 결과를 얻을 수 있습니다. 깊이 있는 접근이 필요합니다."
  ],
  cancer: [
    "가족이나 가까운 사람들과의 시간이 특별한 의미를 가지는 날입니다. 따뜻한 마음으로 주변을 돌보면 큰 보람을 느낄 수 있을 것입니다. 직감을 믿고 행동하세요.",
    "감정적인 안정감을 찾을 수 있는 하루가 될 것입니다. 집에서의 휴식이나 취미 생활이 당신에게 큰 위로가 될 것입니다.",
    "과거에 얽매이지 말고 현재에 집중하세요. 감정의 기복이 클 수 있으니 마음을 차분히 다스리는 것이 중요합니다. 긍정적인 마음가짐을 유지하세요."
  ],
  leo: [
    "당신의 매력과 카리스마가 최고조에 달하는 날입니다. 자신감을 가지고 무대 위에 서세요. 주변의 관심과 인정을 받을 수 있는 절호의 기회입니다.",
    "창의적인 표현력이 빛을 발하는 시기입니다. 예술적 활동이나 자기표현에 적극적으로 나서면 뜻밖의 성과를 거둘 수 있을 것입니다.",
    "자존심을 조금 내려놓고 겸손한 자세를 보이세요. 다른 사람의 의견에도 귀 기울이면 더 큰 성장을 이룰 수 있습니다. 팀워크가 중요한 날입니다."
  ],
  virgo: [
    "세심한 분석력과 완벽주의가 빛을 발하는 날입니다. 디테일에 신경 쓰는 당신의 노력이 인정받을 것입니다. 체계적인 접근으로 문제를 해결해보세요.",
    "건강 관리와 자기 계발에 좋은 시기입니다. 규칙적인 생활과 꾸준한 노력이 장기적으로 큰 도움이 될 것입니다.",
    "완벽을 추구하다 보니 스트레스가 쌓일 수 있습니다. 때로는 80%의 완성도로도 충분하다는 것을 기억하세요. 자신에게 너무 엄격하지 마세요."
  ],
  libra: [
    "조화와 균형을 추구하는 당신의 장점이 빛을 발하는 날입니다. 갈등 상황에서 중재자 역할을 훌륭히 해낼 수 있을 것입니다. 미적 감각도 인정받을 것입니다.",
    "인간관계에서 특별한 진전이 있을 수 있는 날입니다. 사교적인 모임이나 파트너십이 좋은 결과를 가져다줄 것입니다.",
    "결정을 내리기 어려운 상황이 생길 수 있습니다. 우유부단함을 극복하고 용기 있는 선택을 해보세요. 완벽한 선택보다는 최선의 노력이 중요합니다."
  ],
  scorpio: [
    "직감력과 통찰력이 최고조에 달하는 날입니다. 숨겨진 진실을 발견하거나 중요한 결정을 내리기에 좋은 시기입니다. 당신의 신비로운 매력이 빛을 발할 것입니다.",
    "깊이 있는 관계 형성에 유리한 날입니다. 진정성 있는 대화를 통해 상대방과 더 가까워질 수 있을 것입니다. 집중력도 평소보다 뛰어날 것입니다.",
    "의심과 질투심을 조절하는 것이 중요합니다. 부정적인 감정에 휩싸이지 말고 긍정적인 에너지로 전환해보세요. 신뢰와 포용이 더 좋은 결과를 가져다줄 것입니다."
  ],
  sagittarius: [
    "자유롭고 모험적인 정신이 새로운 기회를 가져다주는 날입니다. 여행이나 새로운 학습에 도전해보세요. 당신의 낙천적인 에너지가 주변을 밝게 만들 것입니다.",
    "철학적 사고와 진리 탐구에 좋은 시기입니다. 새로운 관점이나 지식을 습득할 수 있는 기회가 있을 것입니다. 유머 감각도 빛을 발할 것입니다.",
    "약속이나 책임에 대해 좀 더 신중해져야 할 때입니다. 자유로움도 좋지만 다른 사람에 대한 배려도 잊지 마세요. 균형 잡힌 접근이 필요합니다."
  ],
  capricorn: [
    "목표 달성을 위한 체계적인 노력이 결실을 맺는 날입니다. 책임감과 인내력이 인정받을 것입니다. 장기적인 계획을 세우기에도 좋은 시기입니다.",
    "사회적 지위나 경력 발전에 유리한 기회가 찾아올 수 있습니다. 성실함과 전문성이 빛을 발하는 날이니 자신감을 가지고 임하세요.",
    "너무 경직되지 말고 유연성을 발휘해보세요. 때로는 완벽한 계획보다 상황에 맞는 임기응변이 더 좋은 결과를 가져다줄 수 있습니다."
  ],
  aquarius: [
    "독창적인 아이디어와 혁신적인 사고가 빛을 발하는 날입니다. 남들과 다른 접근방식으로 문제를 해결해보세요. 새로운 기술이나 트렌드에 관심을 가져보세요.",
    "친구들과의 관계나 사회적 네트워크가 특별한 도움이 될 것입니다. 인도주의적 활동이나 봉사활동도 큰 보람을 가져다줄 것입니다.",
    "너무 이상주의적으로만 접근하지 말고 현실적인 측면도 고려해보세요. 감정적인 소통에도 더 신경 쓰면 인간관계가 더욱 원만해질 것입니다."
  ],
  pisces: [
    "예술적 감성과 직관력이 최고조에 달하는 날입니다. 창작 활동이나 상상력을 발휘하는 일에 집중해보세요. 타인의 감정을 잘 이해할 수 있는 날이기도 합니다.",
    "영적인 성장이나 내면의 평화를 찾을 수 있는 시기입니다. 명상이나 사색의 시간을 가져보세요. 꿈이나 상징적 메시지에 주의를 기울여보세요.",
    "현실 도피보다는 문제에 정면으로 맞서는 용기가 필요합니다. 다른 사람의 영향을 너무 많이 받지 말고 자신만의 기준을 세워보세요. 명확한 목표 설정이 중요합니다."
  ]
};

const TodayFortunePage = () => {
  const navigate = useNavigate();
  const [fortuneData, setFortuneData] = useState<FortuneData[]>([]);
  const [todayDate, setTodayDate] = useState('');

  // 오늘 날짜 기반으로 시드 생성 (매일 다른 결과를 위해)
  const getTodaySeed = () => {
    const today = new Date();
    const dateString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32비트 정수로 변환
    }
    return Math.abs(hash);
  };

  // 시드 기반 랜덤 생성기
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // 운세 데이터 생성
  const generateFortuneData = () => {
    const seed = getTodaySeed();
    const fortunes: FortuneData[] = [];

    zodiacSigns.forEach((sign, index) => {
      // 각 별자리마다 다른 시드 사용
      const signSeed = seed + index * 1000;
      const score = Math.floor(seededRandom(signSeed) * 100) + 1; // 1-100점
      
      // 메시지 선택 (3개 중 하나)
      const messageIndex = Math.floor(seededRandom(signSeed + 100) * 3);
      const fortune = fortuneMessages[sign.id as keyof typeof fortuneMessages][messageIndex];

      // 점수에 따른 색상 결정
      let color = '';
      if (score >= 80) color = 'text-yellow-400'; // 골드
      else if (score >= 60) color = 'text-green-400'; // 그린
      else if (score >= 40) color = 'text-blue-400'; // 블루
      else color = 'text-gray-400'; // 그레이

      fortunes.push({
        sign,
        rank: 0, // 나중에 설정
        score,
        fortune,
        color
      });
    });

    // 점수순으로 정렬하고 순위 매기기
    fortunes.sort((a, b) => b.score - a.score);
    fortunes.forEach((fortune, index) => {
      fortune.rank = index + 1;
    });

    setFortuneData(fortunes);
  };

  useEffect(() => {
    // 오늘 날짜 설정
    const today = new Date();
    const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    setTodayDate(dateString);

    // 운세 데이터 생성
    generateFortuneData();
  }, []);

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 6) return '✨';
    if (rank <= 9) return '⭐';
    return '💫';
  };

  const getRankText = (rank: number) => {
    if (rank === 1) return '최고의 운세';
    if (rank <= 3) return '매우 좋음';
    if (rank <= 6) return '좋음';
    if (rank <= 9) return '보통';
    return '주의 필요';
  };

  return (
    <StarryBackground>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-4 py-4 bg-space-blue/50 backdrop-blur-sm">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/')}
              className="text-white/80 hover:text-white transition-colors"
            >
              ← 홈으로
            </button>
            <h1 className="text-xl font-light text-white/90">오늘의 운세</h1>
            <div className="w-16"></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Date and Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <p className="text-white/60 text-sm mb-2">{todayDate}</p>
              <h2 className="text-2xl font-light text-white/90 mb-2">✨ 12별자리 운세 순위 ✨</h2>
              <p className="text-white/60 text-sm">매일 새로운 운세로 업데이트됩니다</p>
            </motion.div>

            {/* Fortune Cards */}
            <div className="space-y-3">
              {fortuneData.map((data, index) => (
                <motion.div
                  key={data.sign.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank and Sign Info */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-2xl mb-1">{getRankEmoji(data.rank)}</div>
                      <div className="text-xs text-white/60">#{data.rank}</div>
                    </div>

                    {/* Sign Details */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{data.sign.emoji}</span>
                        <div>
                          <h3 className="text-white/90 font-medium flex items-center gap-1">
                            {data.sign.symbol} {data.sign.name}
                            <span className="text-xs text-white/50">({data.sign.dates})</span>
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-sm font-medium ${data.color}`}>
                              {data.score}점
                            </span>
                            <span className="text-xs text-white/60">
                              {getRankText(data.rank)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Fortune Message */}
                      <p className="text-white/70 text-sm leading-relaxed">
                        {data.fortune}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-center mt-8 text-white/40 text-xs"
            >
              <p>운세는 참고용이며, 실제 결과와 다를 수 있습니다.</p>
              <p>긍정적인 마음가짐이 더 좋은 하루를 만들어갑니다 ✨</p>
            </motion.div>
          </div>
        </main>
      </div>
    </StarryBackground>
  );
};

export default TodayFortunePage;