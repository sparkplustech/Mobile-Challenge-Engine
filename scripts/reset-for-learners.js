#!/usr/bin/env node
/**
 * Reset all courses to learner-ready state:
 * - Clear challenge results, course summaries, and AI feedback
 * - Restore project source files to implementation stubs
 * - Rebuild learner-results/progress.json and README evidence
 *
 * Usage: node scripts/reset-for-learners.js
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PATHWAY_CONFIG = join(ROOT, 'pathway-review', 'pathway-config.json');

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function resetResults(courseId, courseName, totalChallenges) {
  const resultsDir = join(ROOT, 'courses', courseId, 'results');
  mkdirSync(resultsDir, { recursive: true });
  writeFileSync(join(resultsDir, 'challenge-results.json'), '[]\n');
  writeFileSync(join(resultsDir, 'ai-feedback.json'), '[]\n');
  writeFileSync(
    join(resultsDir, 'course-summary.json'),
    JSON.stringify(
      {
        courseId,
        courseName,
        lastUpdated: new Date().toISOString(),
        totalChallenges,
        completedChallenges: 0,
        averageScore: 0,
        completionPercentage: 0,
        badgeLevel: 'none',
        challengeResults: [],
        skillStrengths: [],
        improvementAreas: [],
      },
      null,
      2
    ) + '\n'
  );
}

// --- Course 01: React Native Fundamentals ---

const FUNDAMENTALS_STUBS = {
  'app/_layout.tsx': `import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="challenge/[id]" options={{ title: 'Challenge' }} />
    </Stack>
  );
}
`,
  'app/(tabs)/_layout.tsx': `import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="challenges" options={{ title: 'Challenges' }} />
      <Tabs.Screen name="feed" options={{ href: null }} />
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
`,
  'app/(tabs)/index.tsx': `import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container} testID="home-screen">
      <Text style={styles.title}>Mobile Challenge Engine</Text>
      <Text style={styles.subtitle}>Open Challenges tab to pick a challenge README.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#0f172a' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8, color: '#f8fafc' },
  subtitle: { fontSize: 15, color: '#94a3b8', textAlign: 'center' },
});
`,
  'app/(tabs)/feed.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 07 README */
export default function FeedScreen() {
  return (
    <View style={styles.container} testID="feed-screen">
      <Text style={styles.text}>Feed — implement in challenge 07</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  text: { color: '#94a3b8' },
});
`,
  'app/(tabs)/search.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 03 README */
export default function SearchScreen() {
  return (
    <View style={styles.container} testID="search-screen">
      <Text style={styles.text}>Search — implement in challenge 03</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  text: { color: '#94a3b8' },
});
`,
  'app/(tabs)/profile.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 07 README */
export default function ProfileScreen() {
  return (
    <View style={styles.container} testID="profile-screen">
      <Text style={styles.text}>Profile — implement in challenge 07</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  text: { color: '#94a3b8' },
});
`,
  'app/details/[username].tsx': `import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Stub — implement per challenge 02 README */
export default function DetailsScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  return (
    <View style={styles.container} testID="details-screen">
      <Text style={styles.title}>Details: @{username ?? 'user'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#0f172a' },
  title: { fontSize: 20, fontWeight: '700', color: '#f8fafc' },
});
`,
  'app/auth/login.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 04 README */
export default function LoginScreen() {
  return (
    <View style={styles.container} testID="login-screen">
      <Text style={styles.text}>Login — implement in challenge 04</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  text: { color: '#94a3b8' },
});
`,
  'app/auth/signup.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 04 README */
export default function SignupScreen() {
  return (
    <View style={styles.container} testID="signup-screen">
      <Text style={styles.text}>Sign up — implement in challenge 04</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  text: { color: '#94a3b8' },
});
`,
  'components/ProfileCard.tsx': `import { View } from 'react-native';

/** Stub — implement per challenge 01 README */
export default function ProfileCard() {
  return <View testID="profile-card" />;
}
`,
  'components/FeatureCards.tsx': `import { View } from 'react-native';

/** Stub — implement per challenge 01 README */
export default function FeatureCards() {
  return <View testID="feature-cards" />;
}
`,
  'components/PostFeed.tsx': `import { View } from 'react-native';

/** Stub — implement per challenge 03 README */
export default function PostFeed() {
  return <View testID="post-feed" />;
}
`,
  'components/ImageGallery.tsx': `import { View } from 'react-native';

/** Stub — implement per challenge 03 README */
export default function ImageGallery() {
  return <View testID="image-gallery" />;
}
`,
  'components/SearchBar.tsx': `import { View } from 'react-native';

type SearchBarProps = {
  onSearch?: (query: string) => void;
  placeholder?: string;
};

/** Stub — implement per challenge 03 README */
export default function SearchBar(_props: SearchBarProps) {
  return <View testID="search-bar" />;
}
`,
  'components/MultiStepForm.tsx': `import { View } from 'react-native';

/** Stub — implement per challenge 04 README */
export default function MultiStepForm() {
  return <View testID="multi-step-form" />;
}
`,
  'components/UserList.tsx': `import { View } from 'react-native';

/** Stub — implement per challenge 05 README */
export default function UserList() {
  return <View testID="user-list" />;
}
`,
  'components/WeatherSearch.tsx': `import { View } from 'react-native';

/** Stub — implement per challenge 05 README */
export default function WeatherSearch() {
  return <View testID="weather-search" />;
}
`,
  'lib/api.ts': `/** Stub — API helpers; implement per challenge 05 README */

export type ApiPost = { id: number; title: string; body: string };

export async function fetchPosts(): Promise<ApiPost[]> {
  return [];
}

export async function fetchUsers(): Promise<unknown[]> {
  return [];
}

export async function fetchWeather(_city: string): Promise<unknown> {
  return null;
}
`,
  'lib/storage.ts': `/** Stub — AsyncStorage helpers; implement per challenge 06 README */

export type StoredNote = { id: string; text: string; createdAt: string };
export type StoredUser = { email: string; username: string };
export type ThemeMode = 'light' | 'dark';

export async function getNotes(): Promise<StoredNote[]> {
  return [];
}

export async function saveNotes(_notes: StoredNote[]): Promise<void> {}

export async function getUser(): Promise<StoredUser | null> {
  return null;
}

export async function saveUser(_user: StoredUser | null): Promise<void> {}

export async function getTheme(): Promise<ThemeMode> {
  return 'dark';
}

export async function saveTheme(_theme: ThemeMode): Promise<void> {}
`,
  'hooks/useAuthStorage.tsx': `import { useState } from 'react';

export type StoredUser = { email: string; username: string };

/** Stub — implement per challenge 06 README */
export function useAuthStorage() {
  const [user] = useState<StoredUser | null>(null);
  const [loading] = useState(false);
  const [isLoggedIn] = useState(false);

  return {
    user,
    loading,
    isLoggedIn,
    login: async (_email: string, _password: string) => false,
    logout: async () => {},
    signup: async (_email: string, _password: string, _username: string) => false,
  };
}
`,
  'hooks/useThemeStorage.tsx': `import { useState } from 'react';

export type ThemeMode = 'light' | 'dark';

/** Stub — implement per challenge 06 README */
export function useThemeStorage() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  return { theme, setTheme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) };
}
`,
};

// --- Course 02: Backend Basics ---

const BACKEND_STUBS = {
  'src/server.js': `import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(\`Server on \${PORT}\`));
}

export default app;
`,
  'src/fs-utils.js': `/** Stub — read/write file helpers; implement per challenge 01 README */
export async function readNotesFile() { return []; }
export async function writeNotesFile() {}
`,
  'src/math.js': `/** Stub — implement per challenge 01 README */
export function add(a, b) { return a + b; }
`,
  'src/app.js': `import express from 'express';

/** Stub — Express app; implement per challenge 02 README */
const app = express();
export default app;
`,
  'src/routes/notes.js': `import { Router } from 'express';

/** Stub — implement per challenge 02 README */
const router = Router();
export default router;
`,
  'src/middleware/logger.js': `/** Stub — implement per challenge 02 README */
export function logger(req, _res, next) { next(); }
export function requestLogger(req, _res, next) { next(); }
export function errorHandler(err, _req, res, _next) { res.status(500).json({ error: err.message }); }
`,
  'src/db.js': `/** Stub — Mongoose connection; implement per challenge 03 README */
export async function connectDB() {}
`,
  'src/models/User.js': `/** Stub — User schema; implement per challenge 03 README */
export const User = {};
`,
  'src/routes/users.js': `import { Router } from 'express';

/** Stub — implement per challenge 03 README */
export default Router();
`,
  'src/routes/auth.js': `import { Router } from 'express';

/** Stub — implement per challenge 04 README */
export default Router();
`,
  'src/middleware/auth.js': `/** Stub — implement per challenge 04 README */
export function requireAuth(_req, _res, next) { next(); }
`,
  'src/routes/posts.js': `import { Router } from 'express';

/** Stub — implement per challenge 05 README */
export default Router();
`,
};

// --- Course 03: Advanced React Native ---

const ADVANCED_STUBS = {
  'app/_layout.tsx': `import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="challenge/[id]" options={{ title: 'Challenge' }} />
    </Stack>
  );
}
`,
  'app/(tabs)/index.tsx': `import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container} testID="home-screen">
      <Text style={styles.title}>Advanced React Native</Text>
      <Text style={styles.subtitle}>Open Challenges tab to pick a challenge README.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#0f172a' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8, color: '#f8fafc' },
  subtitle: { fontSize: 15, color: '#94a3b8', textAlign: 'center' },
});
`,
  'components/ProfileCard.tsx': `import { View } from 'react-native';

/** Stub — implement per challenge README */
export default function ProfileCard() {
  return <View testID="profile-card" />;
}
`,
  'components/ReduxDemo.tsx': `import { View } from 'react-native';

/** Stub — implement per challenge 01 README */
export default function ReduxDemo() {
  return <View testID="redux-demo" />;
}
`,
  'components/ProductList.tsx': `import { View } from 'react-native';

/** Stub — implement per challenge 05 README */
export default function ProductList() {
  return <View testID="product-list" />;
}
`,
  'components/ProfileImageUpload.tsx': `import { View } from 'react-native';

/** Stub — implement per challenge 03 README */
export default function ProfileImageUpload() {
  return <View testID="profile-image-upload" />;
}
`,
  'features/counter/counterSlice.ts': `/** Stub — implement per challenge 01 README */
export default function counterReducer(state = { value: 0 }) {
  return state;
}
`,
  'features/todos/todoSlice.ts': `/** Stub — implement per challenge 01 README */
export default function todoReducer(state = { items: [], products: [], productsStatus: 'idle' }) {
  return state;
}
export const addTodo = () => ({ type: 'stub' });
export const removeTodo = () => ({ type: 'stub' });
export const toggleTodo = () => ({ type: 'stub' });
export const fetchProducts = () => ({ type: 'stub' });
`,
  'store/index.ts': `/** Stub — configure Redux store per challenge 01 README */
export const store = { getState: () => ({}), dispatch: () => {}, subscribe: () => () => {} };
export type RootState = Record<string, unknown>;
export type AppDispatch = (action: unknown) => void;
export { useSelector, useDispatch } from 'react-redux';
`,
  'store/cartSlice.ts': `/** Stub — implement per challenge 06 README */
export default function cartReducer(state = { items: [] }) {
  return state;
}
`,
  'lib/firebase.ts': `/** Stub — Firebase config; implement per challenge 03 README */
export const firebaseAuth = {};
export const firestore = { collection: () => ({}) };
export const storage = {};
`,
  'lib/notifications.ts': `/** Stub — implement per challenge 04 README */
export async function scheduleLocalNotification(_title: string, _body: string) {}
`,
  'app/chat.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 03 README */
export default function ChatScreen() {
  return (
    <View style={styles.container} testID="chat-screen">
      <Text style={styles.text}>Chat — implement in challenge 03</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  text: { color: '#94a3b8' },
});
`,
  'app/map.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 04 README */
export default function MapScreen() {
  return (
    <View style={styles.container} testID="map-screen">
      <Text style={styles.text}>Map — implement in challenge 04</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  text: { color: '#94a3b8' },
});
`,
  'app/checkout.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 05 README */
export default function CheckoutScreen() {
  return (
    <View style={styles.container} testID="checkout-screen">
      <Text style={styles.text}>Checkout — implement in challenge 05</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  text: { color: '#94a3b8' },
});
`,
};

// --- Course 04: Challenge Missions ---

const MISSIONS_STUBS = {
  'app/index.tsx': `import { View, Text, StyleSheet } from 'react-native';

export default function MissionsHomeScreen() {
  return (
    <View style={styles.container} testID="missions-home">
      <Text style={styles.title}>Challenge Missions</Text>
      <Text style={styles.subtitle}>Open Challenges tab to pick a mission README.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#0f172a' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8, color: '#38bdf8' },
  subtitle: { fontSize: 15, color: '#94a3b8', textAlign: 'center' },
});
`,
  'components/ProfileCard.tsx': `import { View } from 'react-native';

/** Stub — implement per challenge README */
export default function ProfileCard() {
  return <View testID="profile-card" />;
}
`,
  'app/chat.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 06 README */
export default function ChatScreen() {
  return <View style={styles.container} testID="chat-screen"><Text style={styles.text}>Chat</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
`,
  'app/notes.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 03 README */
export default function NotesScreen() {
  return <View style={styles.container} testID="notes-screen"><Text style={styles.text}>Notes</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
`,
  'app/pokemon/[id].tsx': `import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Stub — implement per challenge 02 README */
export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <View style={styles.container} testID="pokemon-detail"><Text style={styles.text}>Pokemon {id}</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
`,
  'app/movie/[id].tsx': `import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Stub — implement per challenge 08 README */
export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <View style={styles.container} testID="movie-detail"><Text style={styles.text}>Movie {id}</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
`,
  'app/recipes.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 09 README */
export default function RecipesScreen() {
  return <View style={styles.container} testID="recipes-screen"><Text style={styles.text}>Recipes</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
`,
  'app/cart.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 10 README */
export default function CartScreen() {
  return <View style={styles.container} testID="cart-screen"><Text style={styles.text}>Cart</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
`,
  'app/feed.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 11 README */
export default function FeedScreen() {
  return <View style={styles.container} testID="feed-screen"><Text style={styles.text}>Feed</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
`,
  'app/shop.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 12 README */
export default function ShopScreen() {
  return <View style={styles.container} testID="shop-screen"><Text style={styles.text}>Shop</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
`,
  'app/workouts.tsx': `import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 13 README */
export default function WorkoutsScreen() {
  return <View style={styles.container} testID="workouts-screen"><Text style={styles.text}>Workouts</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
`,
  'app/anime/[id].tsx': `import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Stub — implement per challenge 14 README */
export default function AnimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <View style={styles.container} testID="anime-detail"><Text style={styles.text}>Anime {id}</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
`,
  'lib/firebase.ts': `/** Stub — Firebase config; implement per mission READMEs */
export const firebaseAuth = {};
export const firestore = { collection: () => ({}) };
`,
  'store/index.ts': `/** Stub — Redux store for missions */
export const store = { getState: () => ({}), dispatch: () => {}, subscribe: () => () => {} };
export type RootState = Record<string, unknown>;
export type AppDispatch = (action: unknown) => void;
`,
  'store/expenseSlice.ts': `/** Stub — implement per challenge 07 README */
export default function expenseReducer(state = { items: [] }) {
  return state;
}
`,
  'store/cartSlice.ts': `/** Stub — implement per challenge 10/12 README */
export default function cartReducer(state = { items: [] }) {
  return state;
}
`,
};

// --- Course 05: Deployment (minimal code stubs) ---

const DEPLOYMENT_STUBS = {
  'components/ProfileCard.tsx': `import { View } from 'react-native';

/** Stub — implement per challenge README */
export default function ProfileCard() {
  return <View testID="profile-card" />;
}
`,
};

const COURSE_STUBS = {
  '01-react-native-fundamentals': FUNDAMENTALS_STUBS,
  '02-backend-basics': BACKEND_STUBS,
  '03-react-native-advanced': ADVANCED_STUBS,
  '04-challenge-missions': MISSIONS_STUBS,
  '05-deployment': DEPLOYMENT_STUBS,
};

function applyStubs(courseId, stubs) {
  const base = join(ROOT, 'courses', courseId, 'project');
  for (const [rel, content] of Object.entries(stubs)) {
    write(join(base, rel), content);
    console.log(`  ✓ ${courseId}/project/${rel}`);
  }
}

function cleanTestArtifacts(courseId) {
  const testResults = join(ROOT, 'courses', courseId, 'project', 'test-results');
  if (existsSync(testResults)) {
    rmSync(testResults, { recursive: true, force: true });
    console.log(`  ✓ removed ${courseId}/project/test-results`);
  }
}

function loadCourses() {
  if (!existsSync(PATHWAY_CONFIG)) return [];
  const pathway = JSON.parse(readFileSync(PATHWAY_CONFIG, 'utf-8'));
  return pathway.courses || [];
}

function main() {
  console.log('🔄 Resetting mobile-challenge-engine for new learners...\n');

  const courses = loadCourses();

  console.log('📊 Clearing results and scores...');
  for (const course of courses) {
    const configPath = join(ROOT, 'courses', course.id, 'course-config.json');
    let courseName = course.name;
    let totalChallenges = 0;
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      courseName = config.courseName || courseName;
      totalChallenges = (config.challenges || []).length;
    }
    resetResults(course.id, courseName, totalChallenges);
    console.log(`  ✓ ${course.id}/results`);
  }

  const aiInsights = join(ROOT, 'learner-results', 'ai-insights.json');
  if (existsSync(aiInsights)) {
    writeFileSync(aiInsights, '[]\n');
    console.log('  ✓ learner-results/ai-insights.json');
  }

  console.log('\n📝 Restoring project stubs...');
  for (const course of courses) {
    const stubs = COURSE_STUBS[course.id];
    if (stubs) {
      console.log(`\n  ${course.id}:`);
      applyStubs(course.id, stubs);
      cleanTestArtifacts(course.id);
    }
  }

  console.log('\n📈 Updating progress and README evidence...');
  execSync('node scripts/update-progress.js', { cwd: ROOT, stdio: 'inherit' });

  console.log('\n✅ Reset complete. All challenges are unsolved and scores are 0%.');
  console.log('   Learners can start with: cd courses/01-react-native-fundamentals/project && npx expo start');
}

main();
