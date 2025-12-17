import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import type { ActiveOrder } from '../hooks/useActiveOrders';

interface CancelOrderDialogProps {
  open: boolean;
  order: ActiveOrder | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CancelOrderDialog({ open, order, onConfirm, onCancel }: CancelOrderDialogProps) {
  if (!order) return null;

  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl">
              Cancelar Pedido
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base text-gray-600 pt-2">
            ¿Estás seguro de cancelar el pedido <span className="font-semibold text-gray-900">#{order.id}</span> de la mesa <span className="font-semibold text-gray-900">{order.table}</span>?
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">⚠️ Nota:</span> Esta acción liberará la mesa y no se podrá deshacer.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel className="mt-0">
            No, mantener pedido
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Sí, cancelar pedido
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
