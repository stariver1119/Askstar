import { execSync } from 'child_process';

console.log('🌍 다국어 데이터 변환 시작...');

try {
    console.log('🔄 한국어 데이터 변환 중...');
    execSync('npm run convert-ko', { stdio: 'inherit' });
    
    console.log('🔄 영어 데이터 변환 중...');
    execSync('npm run convert-en', { stdio: 'inherit' });
    
    console.log('✅ 모든 언어 변환 완료!');
} catch (error) {
    console.error('❌ Error during data conversion:', error.message);
    process.exit(1);
}
