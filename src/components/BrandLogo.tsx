import asirLogoWhite from '../../assets/branding/logos/cropped/asir-white.png';
import clusterLogoColor from '../../assets/branding/logos/cropped/cluster-color.png';
import clusterLogoWhite from '../../assets/branding/logos/cropped/cluster-white.png';

type BrandLogoTone = 'color' | 'white' | 'asir-white';

interface BrandLogoProps {
  tone?: BrandLogoTone;
  className?: string;
  imageClassName?: string;
}

const logoByTone: Record<BrandLogoTone, string> = {
  color: clusterLogoColor,
  white: clusterLogoWhite,
  'asir-white': asirLogoWhite,
};

const altByTone: Record<BrandLogoTone, string> = {
  color: 'Aseer Health Cluster',
  white: 'Aseer Health Cluster',
  'asir-white': 'Aseer',
};

export function BrandLogo({ tone = 'color', className = '', imageClassName = '' }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <img
        alt={altByTone[tone]}
        className={`h-full w-full object-contain select-none ${imageClassName}`}
        draggable={false}
        src={logoByTone[tone]}
      />
    </span>
  );
}
