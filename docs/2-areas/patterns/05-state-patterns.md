# State Patterns (상태 패턴)

컴포넌트와 애플리케이션 상태를 관리하는 패턴입니다.

---

## 개요

State Patterns는 **상태 관리 전략과 베스트 프랙티스**를 정의합니다. 단순한 로컬 상태부터 복잡한 전역 상태까지, 적절한 패턴을 선택하는 것이 중요합니다.

### 왜 필요한가?
- **예측 가능성**: 상태 변경 로직 명확화
- **유지보수성**: 상태 업데이트 추적 용이
- **성능**: 불필요한 리렌더링 방지
- **확장성**: 애플리케이션 성장에 대응

---

## 1. Controlled vs Uncontrolled

### 1.1 Controlled Components

#### 설명
React가 상태를 완전히 제어하는 패턴입니다. Form 요소의 value를 state와 동기화합니다.

#### 장점
- 상태가 명확 (Single Source of Truth)
- 실시간 유효성 검사 가능
- 조건부 렌더링 쉬움

#### 단점
- 많은 입력 필드 시 보일러플레이트 증가
- 매 입력마다 리렌더링

#### 구현 예제

```tsx
import { useState } from 'react';

export function ControlledInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // 실시간 유효성 검사
    if (newValue.length < 3) {
      setError('Minimum 3 characters');
    } else {
      setError('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        aria-invalid={!!error}
        aria-describedby={error ? 'error-message' : undefined}
      />
      {error && <span id="error-message" role="alert">{error}</span>}
    </div>
  );
}
```

---

### 1.2 Uncontrolled Components

#### 설명
DOM이 상태를 관리하고, React는 ref로 접근만 하는 패턴입니다.

#### 장점
- 성능 우수 (리렌더링 없음)
- 통합 쉬움 (non-React 코드)
- 코드 간결

#### 단점
- 실시간 유효성 검사 어려움
- React 외부 상태 관리

#### 구현 예제

```tsx
import { useRef } from 'react';

export function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value;
    console.log('Submitted:', value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        defaultValue=""
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### 1.3 Hybrid Pattern (React Hook Form)

#### 설명
Uncontrolled를 기본으로 하되, 필요 시 Controlled로 전환하는 하이브리드 패턴입니다.

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
});

type FormData = z.infer<typeof schema>;

export function HybridForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange', // 실시간 검증
  });

  // Watch specific field (controlled처럼 동작)
  const password = watch('password');

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email')}
        type="email"
        aria-invalid={!!errors.email}
      />
      {errors.email && <span role="alert">{errors.email.message}</span>}

      <input
        {...register('password')}
        type="password"
        aria-invalid={!!errors.password}
      />
      {errors.password && <span role="alert">{errors.password.message}</span>}

      {/* Password strength indicator (controlled behavior) */}
      {password && <PasswordStrength password={password} />}

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 2. Form State Management

### 2.1 Field-level State

#### 설명
각 입력 필드가 독립적으로 상태를 관리합니다.

```tsx
function FieldLevelForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // ❌ 필드가 많아지면 관리 어려움
  return (
    <form>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </form>
  );
}
```

---

### 2.2 Object-based State

#### 설명
모든 필드를 하나의 객체로 관리합니다.

```tsx
interface FormState {
  email: string;
  password: string;
  name: string;
}

function ObjectBasedForm() {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    name: '',
  });

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // ✅ 확장 가능하고 관리 쉬움
  return (
    <form>
      <input value={form.email} onChange={handleChange('email')} />
      <input value={form.password} onChange={handleChange('password')} />
      <input value={form.name} onChange={handleChange('name')} />
    </form>
  );
}
```

---

### 2.3 Reducer Pattern

#### 설명
복잡한 상태 로직을 reducer로 관리합니다.

```tsx
import { useReducer } from 'react';

interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: any }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'SET_TOUCHED'; field: string }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.field]: true },
      };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting };
    case 'RESET':
      return {
        values: {},
        errors: {},
        touched: {},
        isSubmitting: false,
      };
    default:
      return state;
  }
}

export function useFormReducer() {
  const [state, dispatch] = useReducer(formReducer, {
    values: {},
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const setField = (field: string, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const setError = (field: string, error: string) => {
    dispatch({ type: 'SET_ERROR', field, error });
  };

  const setTouched = (field: string) => {
    dispatch({ type: 'SET_TOUCHED', field });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  return { state, setField, setError, setTouched, reset };
}
```

---

## 3. Loading States

### 3.1 Boolean Loading State

#### 설명
단순한 로딩 상태를 boolean으로 관리합니다.

```tsx
function SimpleLoading() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data');
      const json = await response.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  return <DataView data={data} />;
}
```

---

### 3.2 State Machine Pattern

#### 설명
유한 상태 기계(FSM)를 사용한 명확한 상태 관리입니다.

```tsx
type LoadingState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: any }
  | { status: 'error'; error: Error };

function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<LoadingState>({ status: 'idle' });

  const execute = async () => {
    setState({ status: 'loading' });
    try {
      const data = await fetcher();
      setState({ status: 'success', data });
    } catch (error) {
      setState({ status: 'error', error: error as Error });
    }
  };

  return { state, execute };
}

// 사용 예제
function DataComponent() {
  const { state, execute } = useAsyncData(() => fetch('/api/data').then(r => r.json()));

  useEffect(() => {
    execute();
  }, []);

  // ✅ 명확한 상태 분기
  switch (state.status) {
    case 'idle':
      return <button onClick={execute}>Load Data</button>;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <DataView data={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
  }
}
```

---

### 3.3 Parallel Loading States

#### 설명
여러 리소스를 동시에 로드하는 패턴입니다.

```tsx
interface ParallelLoadingState {
  user: { loading: boolean; data: User | null; error: Error | null };
  posts: { loading: boolean; data: Post[] | null; error: Error | null };
  comments: { loading: boolean; data: Comment[] | null; error: Error | null };
}

function useParallelData() {
  const [state, setState] = useState<ParallelLoadingState>({
    user: { loading: false, data: null, error: null },
    posts: { loading: false, data: null, error: null },
    comments: { loading: false, data: null, error: null },
  });

  const loadAll = async () => {
    // 모든 요청을 병렬로 시작
    setState({
      user: { loading: true, data: null, error: null },
      posts: { loading: true, data: null, error: null },
      comments: { loading: true, data: null, error: null },
    });

    const [userResult, postsResult, commentsResult] = await Promise.allSettled([
      fetch('/api/user').then(r => r.json()),
      fetch('/api/posts').then(r => r.json()),
      fetch('/api/comments').then(r => r.json()),
    ]);

    setState({
      user: {
        loading: false,
        data: userResult.status === 'fulfilled' ? userResult.value : null,
        error: userResult.status === 'rejected' ? userResult.reason : null,
      },
      posts: {
        loading: false,
        data: postsResult.status === 'fulfilled' ? postsResult.value : null,
        error: postsResult.status === 'rejected' ? postsResult.reason : null,
      },
      comments: {
        loading: false,
        data: commentsResult.status === 'fulfilled' ? commentsResult.value : null,
        error: commentsResult.status === 'rejected' ? commentsResult.reason : null,
      },
    });
  };

  return { state, loadAll };
}

// 사용 예제
function Dashboard() {
  const { state, loadAll } = useParallelData();

  useEffect(() => {
    loadAll();
  }, []);

  // ✅ 각 리소스 독립적으로 표시
  return (
    <div>
      {state.user.loading ? <Spinner /> : <UserCard user={state.user.data} />}
      {state.posts.loading ? <Spinner /> : <PostList posts={state.posts.data} />}
      {state.comments.loading ? <Spinner /> : <CommentList comments={state.comments.data} />}
    </div>
  );
}
```

---

## 4. Error States

### 4.1 Error Boundaries

#### 설명
컴포넌트 트리 전체의 에러를 catch하는 패턴입니다.

```tsx
import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <div role="alert">
          <h2>Something went wrong</h2>
          <pre>{this.state.error.message}</pre>
          <button onClick={this.reset}>Try again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 사용 예제
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <h3>Error: {error.message}</h3>
      <button onClick={reset}>Retry</button>
    </div>
  )}
>
  <DataComponent />
</ErrorBoundary>
```

---

### 4.2 Field-level Errors

#### 설명
각 필드별로 에러를 관리합니다.

```tsx
interface FieldErrors {
  [field: string]: string | undefined;
}

function useFieldErrors() {
  const [errors, setErrors] = useState<FieldErrors>({});

  const setFieldError = (field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return { errors, setFieldError, clearFieldError, clearAllErrors };
}

// 사용 예제
function FormWithErrors() {
  const { errors, setFieldError, clearFieldError } = useFieldErrors();

  const validateEmail = (email: string) => {
    if (!email.includes('@')) {
      setFieldError('email', 'Invalid email format');
    } else {
      clearFieldError('email');
    }
  };

  return (
    <form>
      <input
        type="email"
        onChange={(e) => validateEmail(e.target.value)}
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? 'email-error' : undefined}
      />
      {errors.email && (
        <span id="email-error" role="alert">
          {errors.email}
        </span>
      )}
    </form>
  );
}
```

---

## 5. Global State Patterns

### 5.1 Context + useReducer

#### 설명
전역 상태를 Context와 useReducer로 관리합니다.

```tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: string[];
}

type AppAction =
  | { type: 'SET_USER'; user: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_THEME'; theme: 'light' | 'dark' }
  | { type: 'ADD_NOTIFICATION'; message: string }
  | { type: 'REMOVE_NOTIFICATION'; index: number };

const initialState: AppState = {
  user: null,
  theme: 'light',
  notifications: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.message],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((_, i) => i !== action.index),
      };
    default:
      return state;
  }
}

const AppStateContext = createContext<AppState | null>(null);
const AppDispatchContext = createContext<React.Dispatch<AppAction> | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within AppProvider');
  }
  return context;
}

// 사용 예제
function UserProfile() {
  const { user } = useAppState();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return user ? (
    <div>
      <h3>{user.name}</h3>
      <button onClick={handleLogout}>Logout</button>
    </div>
  ) : null;
}
```

---

### 5.2 Zustand Pattern

#### 설명
Zustand 라이브러리를 사용한 전역 상태 관리입니다.

```tsx
import { create } from 'zustand';

interface Store {
  count: number;
  user: User | null;
  increment: () => void;
  decrement: () => void;
  setUser: (user: User) => void;
}

export const useStore = create<Store>((set) => ({
  count: 0,
  user: null,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setUser: (user) => set({ user }),
}));

// 사용 예제
function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

---

## 구현 우선순위

### 🔴 High Priority (즉시 구현)
1. **Controlled/Uncontrolled** - Form 기본
2. **Loading State Machine** - 명확한 상태 관리
3. **Error Boundaries** - 에러 처리 필수

### 🟡 Medium Priority
4. **Reducer Pattern** - 복잡한 폼
5. **Context + useReducer** - 전역 상태

### 🟢 Low Priority
6. **Zustand/Jotai** - 특정 사용 사례

---

## 참고 자료

### 주요 라이브러리
- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/
- **Zustand**: https://zustand-demo.pmnd.rs/
- **Jotai**: https://jotai.org/
- **XState**: https://xstate.js.org/ (State Machines)

### 아티클
- **Kent C. Dodds - Application State Management**: https://kentcdodds.com/blog/application-state-management-with-react
- **React Docs - Managing State**: https://react.dev/learn/managing-state

### 관련 문서
- [Behavior Patterns](./01-behavior-patterns.md)
- [Composition Patterns](./04-composition-patterns.md)
