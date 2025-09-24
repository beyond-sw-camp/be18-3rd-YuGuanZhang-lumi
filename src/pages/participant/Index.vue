<template>
  <div>
    <v-btn color="primary" @click="dialog = true">초대발송</v-btn>

    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">
          {{ channel?.name || '초대 발송' }}
        </v-card-title>

        <!-- 발송 성공 후 코드 보여주기 -->
        <div v-if="invitationCode" class="pa-4">
          <p class="text-subtitle-1">
            ✅ 초대 코드:
            <strong
              >{{ invitationCode }}<br />
              유효기간 7일입니다.
            </strong>
          </p>
        </div>

        <!-- 발송 전일 때만 역할 선택 보이도록 -->
        <div v-else>
          <v-select
            v-model="selectedRoleId"
            :items="roles"
            item-title="name"
            item-value="id"
            label="역할 선택"
            outlined
            hide-details
          />
        </div>

        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">닫기</v-btn>
          <v-btn
            v-if="!invitationCode"
            color="primary"
            :disabled="!selectedRoleId"
            @click="sendInvitation"
          >
            발송
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/authStore';

export default {
  name: 'InviteDialog',
  props: {
    channel: {
      type: Object,
      required: false,
      default: () => ({ name: '', subject: '' }),
    },
  },
  data() {
    return {
      dialog: false,
      selectedRoleId: null,
      invitationCode: null,
      roles: [
        { id: 2, name: '학생' },
        { id: 3, name: '학부모' },
      ],
    };
  },
  methods: {
    async sendInvitation() {
      console.log('InviteDialog channel:', this.channel);
      try {
        const authStore = useAuthStore();
        const channelId = this.$route.params.channelId;

        const result = await authStore.sendInvitation(channelId, this.selectedRoleId);
        console.log('초대 발송 성공', result);

        // 🔹 응답에서 초대 코드 추출
        if (result?.data?.[0]?.invitationCode) {
          this.invitationCode = result.data[0].invitationCode;
        }

        this.selectedRoleId = null;
      } catch (err) {
        console.error(err);
      }
    },
    closeDialog() {
      this.dialog = false;
      this.invitationCode = null; // 닫을 때 초기화
    },
  },
};
</script>
