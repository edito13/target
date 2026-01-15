import axios from "axios";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import Input from "@/components/Input";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import CurrencyInput from "@/components/CurrencyInput";
import TransactionType from "@/components/TransactionType";

import { TransactionTypes } from "@/types";
import useNotifications from "@/hooks/useNotifications";
import { NumberToCurrency } from "@/utils/numberToCurrency";
import useTargetDatabase from "@/database/useTargetDatabase";
import useTransactionsDatabase from "@/database/useTransactionsDatabase";

interface TransactionProps {}

const Transaction: React.FC<TransactionProps> = () => {
  const { handleNotificate } = useNotifications();
  const params = useLocalSearchParams<{ id: string }>();
  const targetDatabase = useTargetDatabase();
  const transactionsDatabase = useTransactionsDatabase();

  const [amount, setAmount] = useState(0);
  const [observation, setObservation] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [type, setType] = useState<TransactionTypes>(TransactionTypes.Input);

  const handleCreate = async () => {
    const payload = { amount, observation, target_id: Number(params.id) };
    const target = await targetDatabase.show(payload.target_id);

    try {
      if (amount <= 0) {
        return Alert.alert(
          "Atenção",
          "Preencha o valor e este deve ser maior que zero."
        );
      }

      setIsCreating(true);
      if (type === TransactionTypes.Output && amount > target.current) {
        return Alert.alert(
          "Valor insuficiente",
          "A quantidade desejada é superior a quantidade acumulada até agora.",
          [
            {
              text: "OK",
              onPress: () => {
                setAmount(0), setIsCreating(false);
              },
            },
          ]
        );
      }

      if (
        type === TransactionTypes.Input &&
        amount > target.amount - target.current
      ) {
        return Alert.alert(
          "Valor ultrapassado",
          "A quantidade inserida é superior a quantidade necessária para atingir a meta, use a diferença restante.",
          [
            {
              text: "OK",
              onPress: () => {
                setAmount(target.amount - target.current), setIsCreating(false);
              },
            },
          ]
        );
      }

      await transactionsDatabase.create({
        ...payload,
        amount: type === TransactionTypes.Output ? amount * -1 : amount,
      });
      // console.log("var1: " + process.env.EXPO_PUBLIC_SENDER_ID);
      // console.log("var2: " + process.env.EXPO_PUBLIC_KUMBI_SMS_KEY);

      // await axios.post(
      //   "https://oi.kumbify.com/api/sms/send",
      //   {
      //     to: "244941059086",
      //     body: "Este é o seu código de confirmação: 0006",
      //     from: process.env.EXPO_PUBLIC_SENDER_ID,
      //   },
      //   {
      //     headers: {
      //       "kumbi-api-key": "Bearer " + process.env.EXPO_PUBLIC_KUMBI_SMS_KEY,
      //     },
      //   }
      // );
      await handleNotificate({
        title: "Nova transação",
        message: `Sua transação de ${NumberToCurrency(
          amount
        )} foi feita com sucesso.`,
      });

      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a transação.");
      console.log(error);
      setIsCreating(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <PageHeader
        title="Nova transação"
        subtitle="A cada valor guardado você fica mais próximo da sua meta. Se esforce para guardar e evitar retirar."
      />

      <View style={{ marginTop: 32, gap: 24 }}>
        <TransactionType selected={type} onChange={setType} />
        <CurrencyInput
          value={amount}
          label="Valor (R$)"
          onChangeValue={setAmount}
        />
        <Input
          value={observation}
          label="Motivo (opcional)"
          onChangeText={setObservation}
          placeholder="Ex: Investir em CDB de 110% no banco XPTO"
        />
        <Button
          title="Salvar"
          onPress={handleCreate}
          isProcessing={isCreating}
        />
      </View>
    </View>
  );
};

export default Transaction;
