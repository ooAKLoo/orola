import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-orola-cream">
      {/* Header */}
      <div className="px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-3 flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-lg bg-orola-l1 flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 text-orola-bark/60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.button>
        <h1 className="text-[14px] font-medium text-orola-bark">隐私政策</h1>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <div className="space-y-3">
          <Section title="概述">
            <P>
              Orola（音落）是一款基于地理位置的声音发现应用。我们重视您的隐私，
              本政策说明我们如何收集、使用和保护您的信息。
            </P>
          </Section>

          <Section title="我们收集的信息">
            <P>
              <B>1. 位置信息（GPS 坐标）</B>
              <br />
              当您使用本应用时，我们通过浏览器的定位 API
              获取您的实时经纬度坐标。这些数据用于：
            </P>
            <Ul>
              <Li>发现您附近 5 公里范围内的声音</Li>
              <Li>计算您与声音之间的距离</Li>
              <Li>判断您是否在收听范围内</Li>
            </Ul>
            <P>
              <B>2. 留声位置</B>
              <br />
              当您主动创建一条声音时，您当时的经纬度坐标会与声音记录一起保存到服务器。
              这是产品核心功能所必需的——其他用户需要走到该位置附近才能收听。
            </P>
            <P>
              <B>3. 音频录音</B>
              <br />
              您通过应用内录音功能录制的音频文件存储在我们的云端服务器上。
              本应用仅支持现场录音，不支持从相册或文件系统选择音频。
              单次录音上限为 60 秒。我们不会对音频内容进行分析或用于其他目的。
            </P>
          </Section>

          <Section title="我们不收集的信息">
            <Ul>
              <Li>我们不收集您的姓名、邮箱或手机号</Li>
              <Li>我们不追踪您的位置移动轨迹</Li>
              <Li>我们不使用 Cookie 进行广告追踪</Li>
              <Li>我们不将您的数据出售给第三方</Li>
            </Ul>
          </Section>

          <Section title="数据存储与安全">
            <P>
              您的数据存储在 Supabase 提供的云端基础设施上，传输过程使用 HTTPS
              加密。我们采取合理的技术措施保护您的数据安全，但无法保证互联网传输的绝对安全性。
            </P>
          </Section>

          <Section title="数据保留与删除">
            <P>
              您录制的声音及其关联的位置信息将持续保存，直到您请求删除。
              如需删除您创建的内容，请通过应用内的反馈渠道联系我们。
            </P>
          </Section>

          <Section title="第三方服务">
            <P>本应用使用以下第三方服务：</P>
            <Ul>
              <Li>
                <B>Supabase</B> — 数据存储与文件托管
              </Li>
              <Li>
                <B>浏览器 Geolocation API</B> — 获取设备位置（由浏览器控制权限）
              </Li>
            </Ul>
          </Section>

          <Section title="您的权利">
            <P>您可以随时：</P>
            <Ul>
              <Li>在浏览器设置中撤销位置权限</Li>
              <Li>请求删除您录制的声音及关联数据</Li>
              <Li>停止使用本应用，我们不会继续收集任何信息</Li>
            </Ul>
          </Section>

          <Section title="政策更新">
            <P>
              本隐私政策可能会不时更新。重大变更时，我们会在应用内通知您。
              继续使用本应用即表示您同意更新后的政策。
            </P>
          </Section>

          <Section title="联系我们">
            <P>
              如对本隐私政策有任何疑问，请通过应用内的反馈渠道联系我们。
            </P>
          </Section>

          <p className="text-[9px] text-orola-bark/30 pt-2 pb-4">
            最后更新：2026 年 3 月 1 日
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-orola-l1 rounded-2xl p-4">
      <h2 className="text-[9px] font-medium text-orola-bark/40 uppercase tracking-wide mb-2">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] text-orola-bark/70 leading-relaxed">{children}</p>
  );
}

function B({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-orola-bark/80">{children}</span>;
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-1 ml-2">{children}</ul>;
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-[11px] text-orola-bark/70 leading-relaxed flex gap-2 items-start">
      <span className="text-orola-bark/30 mt-0.5">·</span>
      <span>{children}</span>
    </li>
  );
}
