import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TermsPage() {
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
        <h1 className="text-[14px] font-medium text-orola-bark">用户协议</h1>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <div className="space-y-3">
          <Section title="服务说明">
            <P>
              Orola（音落）是一款基于地理位置的声音分享平台。用户可以在特定地点录制并留下声音，
              其他用户需要亲临该地点附近才能收听。使用本服务即表示您同意以下条款。
            </P>
          </Section>

          <Section title="内容录制规范">
            <P>
              本应用仅支持现场录音功能。您录制的内容应当是：
            </P>
            <Ul>
              <Li>您本人的语音、歌声或即兴创作</Li>
              <Li>所在环境的自然声音（风声、雨声、街道声等）</Li>
              <Li>您拥有合法权利的原创音频内容</Li>
            </Ul>
          </Section>

          <Section title="版权声明与责任">
            <P>
              <B>禁止行为：</B>您不得通过任何方式录制或传播受版权保护的第三方音乐、歌曲、
              有声读物或其他受知识产权保护的内容。
            </P>
            <P>
              <B>用户责任：</B>您对自己录制和上传的所有内容承担完全的法律责任。
              如因您上传的内容侵犯他人知识产权或其他合法权益而产生任何纠纷、索赔或损失，
              由您本人承担全部责任。
            </P>
            <P>
              <B>平台免责：</B>Orola 作为信息存储空间服务提供者，不对用户上传的内容进行事前审核。
              平台不对用户内容的合法性、准确性承担担保责任。
            </P>
          </Section>

          <Section title="侵权通知与删除">
            <P>
              本平台遵循"通知—删除"原则（依据《信息网络传播权保护条例》的避风港规则）。
              如果您认为平台上的某段声音侵犯了您的合法权益，请通过以下方式联系我们：
            </P>
            <Ul>
              <Li>提供侵权内容的具体描述和位置</Li>
              <Li>提供您拥有相关权利的初步证明</Li>
              <Li>我们将在收到有效通知后及时删除涉嫌侵权的内容</Li>
            </Ul>
          </Section>

          <Section title="内容管理">
            <P>
              我们保留在以下情况下删除用户内容的权利：
            </P>
            <Ul>
              <Li>收到合法有效的侵权通知</Li>
              <Li>内容违反法律法规或本协议</Li>
              <Li>内容包含违法、色情、暴力或其他不当信息</Li>
            </Ul>
            <P>
              对于多次违规的用户，我们保留限制或终止其使用服务的权利。
            </P>
          </Section>

          <Section title="录音时长限制">
            <P>
              单次录音时长上限为 60 秒。此限制旨在鼓励用户分享简短的环境声音和个人表达，
              而非完整的音乐作品。
            </P>
          </Section>

          <Section title="协议变更">
            <P>
              我们可能会不时修订本协议。修订后的协议将在应用内公布，
              继续使用本服务即视为您同意修订后的协议内容。
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
